import jwt from "jsonwebtoken" // import 'jsonwebtoken' library to verify JSON web tokens for authentication

const isAuthenticated = async (req, res, next) => { // create a middleware to check whether the user making request to the backend is authenticated or not
    // it takes the following arguments: request made by the user to backend as object, response given by the backend as object, and next function or middleware in the flow
    try {
        let { token } = req.cookies // get user's JWT from cookies of request object

        if (!token) return res.status(400).json({ message: "user doesn't have token" }) // if JWT is not found in cookies, return an error response that user doesn't have a JWT

        let verifyToken = jwt.verify(token, process.env.JWT_SECRET) // verify the JWT using the JWT secret key defined in environment variable 'JWT_SECRET'

        if (!verifyToken) return res.status(400).json({ message: "user doesn't have valid token" }) // if the user's JWT is not verified, return an error message that user doesn't have a valid JWT

        req.userId = verifyToken.userId // set the user's request object's 'userId' property to the value of 'userId' property extracted from the verified JWT

        next() // call the next middleware and/or function in the flow
    } catch (error) { // if any error occurs while checking user's authentication status
        console.log(error) // log the error to the console to know what error occurred
        return res.status(500).json({ message: `Error occurred while authenticating user: ${error}` }) // return a 500 code response with an error message containing the error that occurred
    }
}

export default isAuthenticated // export this middleware to use it in other files