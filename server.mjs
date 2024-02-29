import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Admin from './mongooseSchema.mjs'

// Load environment variables from .env file
dotenv.config()

// Initialize Express app
const app = express()

// Set the port to listen on, fallback to 5000 if not specified in the environment
const PORT = process.env.PORT || 5000

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true')
    .then(() => console.log('Connected to DB'))
    .catch(error => console.log(error))

// Middleware
app.use(cors({
    origin: `http://localhost:${process.env.CLIENT_PORT}`, // Allow requests from this origin
    credentials: true // Allow sending cookies with CORS requests
}));
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

app.get('/admin/verification', TokenAuthorization, (req, res) => {
    if(TokenAuthorization.isAuthenticated) {
        res.redirect(`/admin/dashboard/:${bcrypt.hash(tokenAuthorization.username)}`)
    }
})

app.get('/admin/dashboard/:id', (req, res)=> {
    
})

function CaptureToken(req) {
    if (req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1]
        return token
} else {
    console.log("No Token Received")
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
          console.log(decoded)
          next() // Allow request to proceed
          return decoded
        }
      });
} catch (err) {
    console.log(err)
}   
}

// Route to handle admin authorization
app.post('/admin', userAuthentication, async (req, res) => {
    try {
        const {username} = await getAdminData()
        // Generate JWT token for authentication
        const accessToken = jwt.sign({username, isAuthenticated: true}, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })
        // Respond with the token
        res.json({ accessToken })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

// Middleware to authenticate users
async function userAuthentication(req, res, next) {
    try {
        const { username, password } = await getAdminData()

        // Hash the retrieved username and password
        const hashedPassword = await bcrypt.hash(password, 10)
        const hashedUsername = await bcrypt.hash(username, 10)

        // Retrieve user and pass from the request body
        const { user, pass } = req.body;

        // Compare the hashed values with the input
        const isPasswordValid = bcrypt.compareSync(pass, hashedPassword)
        const isUsernameValid = bcrypt.compareSync(user, hashedUsername)

        // If both username and password are valid, proceed to the next middleware
        if (isPasswordValid && isUsernameValid) {
            next()
        } else {
            // If either username or password is invalid, send accessToken revoked message
            return res.send({ accessToken: 'revoked' })
        }
    } catch (err) {
        console.log(err);
        // Handle errors appropriately
        res.status(500).send({ error: 'Internal server error' })
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
