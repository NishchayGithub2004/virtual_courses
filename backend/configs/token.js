import jwt from "jsonwebtoken"; // import 'jsonwebtoken' library to create and verify JSON Web Tokens (JWTs) for user authentication

export const generateToken = async (userId) => { // create a function to generate a JWT for a user, take user's unique ID as argument for whom JWT is being created
    try {
        // create a JWT for user with it's unique ID provided, secret key is used to sign the JWT to prevent tampering, the created JWT expires in 7 days
        let token = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return token; // return the JWT created
    } catch (error) { // if any error occurs while creating JWT
        console.log("Error occured while creating JWT: ", error); // log the error message to the console to know what error occured
    }
};