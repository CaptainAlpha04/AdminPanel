import express from 'express'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Admin from '../MongooseSchemas/adminSchema.mjs'
import cookieParser from 'cookie-parser'
import cors from 'cors'


export default (app) => {

// Middleware for CORS
app.use(cors({
    origin: `http://localhost:${process.env.CLIENT_PORT}`, // Allow requests from this origin
    credentials: true // Allow sending cookies with CORS requests
}))

app.use(express.json()) // Parse JSON bodies
app.use(bodyParser.json()) // Parse JSON bodies (deprecated, can be removed if express.json() is sufficient)
    
// Function to get admin data from the database
async function getAdminData() {
    try {
        const user = await Admin.findOne()
        if (!user) {
            res.send({response: `Can't find the user!`})
            return null
        }
        return user
    } catch (err) {
        console.log(err)
        throw err // Re-throw the error to be handled by the caller
    }
}

// Admin Verification Route, checks for Token Authorization and redirects
// to a secure address 
app.get('/admin/verification', TokenAuthorization, (req, res) => {

    // Verifies the authentication Token Flag
    if(req.decode.isAuthenticated) {
        
        const redirectURL = req.decode.exp + req.decode.iat

        // Redirects to a newly Generated URL
        res.redirect(`/admin/dashboard/${redirectURL}`)
    
        console.log(`${req.decode.username} has logged In!`)
        
    }
})

function CaptureToken(req) {
    if (req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1]
        return token
} else {
    res.status(301)
}
}

async function TokenAuthorization(req, res, next) {
//Capture the JWT token and split it for authorization 
try {
    const token = CaptureToken(req)
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          // Handle error (e.g., invalid token, expired token)
          res.status(401).json({ message: 'Unauthorized' })
          return err
        } else {
          // Token is valid, proceed with the request
          req.decode = decoded
          next() // Allow request to proceed
        }
      })

} catch (err) {
    res.clearCookie("token")
    console.log(err)
}   
}

// Route to handle admin authorization
app.post('/admin', userAuthentication, async (req, res) => {
    try {
        const {username} = await getAdminData()
        // Generate JWT token for authentication
        const accessToken = jwt.sign({username, isAuthenticated: true}, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })
        // Respond with the cookie
        await res.cookie("token", accessToken, {
             secure: true,
             httpOnly: true,
        })
        res.send({token: Math.random()})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Middleware to authenticate users
async function userAuthentication(req, res, next) {
    try {
        const { username, password } = await getAdminData()

        // Retrieve user and pass from the request body
        const { user, pass } = req.body;

        // Compare the hashed values with the input
        const isPasswordValid = bcrypt.compareSync(pass, password)
        const isUsernameValid = username === user
        // If both username and password are valid, proceed to the next middleware
        if (isPasswordValid && isUsernameValid) {
            next()
        } else {
            // If either username or password is invalid, send accessToken revoked message
            res.status(201)
        }
    } catch (err) {
        console.log(err)
        // Handle errors appropriately
        res.status(500).send({ error: 'Internal server error' })
    }
}
}