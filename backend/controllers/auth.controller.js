import { generateToken } from "../configs/token.js" // import 'generateToken' function to generate JSON Web Token
import validator from "validator" // import 'validator' library to validate user input
import bcrypt from "bcryptjs" // import 'bcryptjs' library to encrypt user password
import User from "../models/user.model.js" // import 'User' model to interact with user data
import sendMail from "../configs/mail.js" // import 'sendMail' function to send email to user

export const signup = async (req, res) => { // create and export a function called 'signUp' to create a new account of the user
    try {
        let { name, email, password, role } = req.body // extract new user's name, email, password, and role (student or teacher) from request body

        let existUser = await User.findOne({ email }) // check if email already exist in the database

        // if it does, it means that the user is already registered in the app, so we return a 400 status code and a JSON object containing message that user already exists
        if (existUser) return res.status(400).json({ message: "User already exists" })

        // if user doesn't provide a valid email address, return a 400 status code and a JSON object containing message that email is invalid
        if (!validator.isEmail(email)) return res.status(400).json({ message: "Please enter valid email" })

        // if user doesn't provide a password with minimum length of 8 characters, return a 400 status code and a JSON object containing message that password is weak 
        if (password.length < 8) return res.status(400).json({ message: "Please enter a strong password" })

        let hashPassword = await bcrypt.hash(password, 10) // use 'bcryptjs' library to encrypt the password given by the user with a salt value of 10, leading to stronger encryption

        let user = await User.create({ name, email, password: hashPassword, role }) // create a new user with the following details provided: name, email, encrypted password, and role (student or teacher)

        let token = await generateToken(user._id) // generate a JSON Web Token for the new user using 'generateToken' function, pass new user's unique ID to the function to know for whom the JWT is being generated

        res.cookie("token", token, { // create a cookie with name 'token' and value being the generate JWT and provide the following configuration to it
            httpOnly: true, // cookie can only be accessed by HTTP requests and not JavaScript code running in the browser so that it cannot be accessed by hackers
            secure: false, // cookie can only be sent over HTTP connections, not HTTPS
            sameSite: "Strict", // cookie can only be sent to the same site as the one that sent the request
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie will expire after 7 days
        })

        return res.status(201).json(user) // create a 200 status code response with a JSON object containing the new user's details
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
}

export const login = async (req, res) => { // create and export a function called 'login' to login the user
    try {
        let { email, password } = req.body // extract user's email and password from request body

        let user = await User.findOne({ email }) // check if email already exist in the database

        // if it doesn't, it means that the user is not registered in the app, so we return a 400 status code and a JSON object containing message that user does not exist
        if (!user) return res.status(400).json({ message: "User does not exist" })

        let isMatch = bcrypt.compare(password, user.password) // use 'bcryptjs' library to compare the password given by the user with the encrypted password stored in the database

        if (!isMatch) return res.status(400).json({ message: "Incorrect Password" }) // if password does not match, return a 400 status code and a JSON object containing message that password is incorrect

        let token = await generateToken(user._id) // generate a JSON Web Token for the user using 'generateToken' function, pass user's unique ID to the function to know for whom the JWT is being generated

        res.cookie("token", token, { // create a cookie with name 'token' and value being the generate JWT and provide the following configuration to it
            httpOnly: true, // cookie can only be accessed by HTTP requests and not JavaScript code running in the browser so that it cannot be accessed by hackers
            secure: false, // cookie can only be sent over HTTP connections, not HTTPS
            sameSite: "Strict", // cookie can only be sent to the same site as the one that sent the request
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie will expire after 7 days
        })

        return res.status(200).json(user) // create a 200 status code response with a JSON object containing the new user's details
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
}

export const logout = async (_, res) => { // create and export a function called 'logOut' to logout the user, it only takes response given by the backend as an argument in object form
    try {
        await res.clearCookie("token") // clear the cookie named 'token' from the response object to log the user out as it will remove it's JWT
        return res.status(200).json({ message: "Logged out successfully" }) // return a 200 status code response with a JSON object containing message that user was logged out successfully
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
}

export const googleSignup = async (req, res) => { // create and export function called 'googleSignup' to register a new user using Google
    try {
        const { name, email, role } = req.body // extract new user's name, email, and role (student or teacher) from request body

        let user = await User.findOne({ email }) // check if email already exist in the database

        // if it does, it means that the user is already registered in the app, so we return a 400 status code and a JSON object containing message that user already exists
        if (user) return res.status(400).json({ message: "User already exists" })

        // if user doesn't exist in the database, create one with the provided name, email, and role
        if (!user) user = await User.create({ name, email, role })

        let token = await generateToken(user._id) // generate a JSON Web Token for the user using 'generateToken' function, pass user's unique ID to the function to know for whom the JWT is being generated

        res.cookie("token", token, { // create a cookie with name 'token' and value being the generate JWT and provide the following configuration to it
            httpOnly: true, // cookie can only be accessed by HTTP requests and not JavaScript code running in the browser so that it cannot be accessed by hackers
            secure: false, // cookie can only be sent over HTTP connections, not HTTPS
            sameSite: "Strict", // cookie can only be sent to the same site as the one that sent the request
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie will expire after 7 days
        })

        return res.status(200).json(user) // create a 200 status code response with a JSON object containing the new user's details
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
}

export const sendOtp = async (req, res) => { // create and export a function called 'sendOtp' to send an OTP to the user's email
    try {
        const { email } = req.body // extract user's email from request body

        const user = await User.findOne({ email }) // check if user with the given email exists in the database

        if (!user) return res.status(404).json({ message: "User not found" }) // if user does not exist, return a 404 status code response with a JSON object containing message that user not found

        const otp = Math.floor(1000 + Math.random() * 9000).toString() // generate a random 4-digit OTP in string form

        user.resetOtp = otp, // set value of 'resetOtp' property of user object to the generated OTP
        user.otpExpires = Date.now() + 5 * 60 * 1000, // set value of 'otpExpires' property of user object to 5 minutes from the time the OTP was sent
        user.isOtpVerifed = false // set value of 'isOtpVerifed' property of user object to false as OTP is not initially verified yet

        await user.save() // save the updated user object to the database

        await sendMail(email, otp) // send the OTP to the user's email using 'sendMail' function, provide the email of user to send the OTP to and the OTP to send itself

        return res.status(200).json({ message: "Email successfully sent" }) // return a 200 status code response with a JSON object containing message that email was successfully sent
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
}

export const verifyOtp = async (req, res) => { // create and export a function called'verifyOtp' to verify the OTP sent to the user's email
    try {
        const { email, otp } = req.body // extract user's email and OTP from request body

        const user = await User.findOne({ email }) // check if user with the given email exists in the database

        // if user does not exist or OTP does not match or OTP has expired, return a 400 status code response with a JSON object containing message that OTP is invalid
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) return res.status(400).json({ message: "Invalid OTP" })

        user.isOtpVerifed = true // set value of 'isOtpVerifed' property of user object to true
        user.resetOtp = undefined  // set value of 'resetOtp' property of user object to undefined as user has verified provided OTP so they don't need another one
        user.otpExpires = undefined // set value of 'otpExpires' property of user object to undefined as user has verified provided OTP so it has no question of expiring now

        await user.save() // save the updated user object to the database

        return res.status(200).json({ message: "OTP verified" }) // return a 200 status code response with a JSON object containing message that OTP was verified
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
}

export const resetPassword = async (req, res) => { // create and export a function called 'resetPassword' to reset the user's password
    try {
        const { email, password } = req.body // extract user's email and new password from request body

        const user = await User.findOne({ email }) // check if user with the given email exists in the database

        // if user does not exist or OTP is not verified, return a 404 status code response with a JSON object containing message that OTP verification is required
        if (!user || !user.isOtpVerifed) return res.status(404).json({ message: "OTP verfication required" })

        const hashPassword = await bcrypt.hash(password, 10) // use 'bcryptjs' library to encrypt the new password given by the user with a salt value of 10, leading to stronger encryption

        user.password = hashPassword // set value of 'password' property of user object to the encrypted new password

        user.isOtpVerifed = false // set value of 'isOtpVerifed' property of user object to false as OTP to confirm new password has not been verified yet

        await user.save() // save the updated user object to the database

        return res.status(200).json({ message: "Password Reset Successfully" }) // return a 200 status code response with a JSON object containing message that password was reset successfully
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
}