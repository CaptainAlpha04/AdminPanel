import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../MongooseSchemas/adminSchema.mjs'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// exporting module
export default (app) => {

/*
* MiddleWares for accessing and querying mongodb
* database, The database stores and retrieves the data
* of the top-level admin user
*/


// Function to get admin data from the database
async function getAdminData(res) {
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

// Creates a new Admin using admin schema !!experimental
async function CreateUserAdmin() {
    const admin = await Admin.create({
        username: "admin",
        password: (await bcrypt.hash("pass", 10)).toString()
    })
}

/* Middlewares for parsing data and CORS */

// Middleware for CORS
app.use(cors({
    origin: `http://localhost:${process.env.CLIENT_PORT}`, // Allow requests from this origin
    credentials: true // Allow sending cookies with CORS requests
}))

app.use(cookieParser()) // Cookie parser middleware
app.use(express.json()) // Parse JSON bodies

/* Middlewares for Authenticating and Authorizing the users */

// Middleware to authenticate users
async function userAuthentication(req, res, next) {
    try {
        const { username, password } = await getAdminData(res)

        // Retrieve user and pass from the request body
        const { user, pass } = req.body
        // Compare the hashed values with the input
        const isPasswordValid = bcrypt.compareSync(pass, password)
        const isUsernameValid = username === user || " "
        // If both username and password are valid, proceed to the next middleware
        if (isPasswordValid && isUsernameValid) {
            next()
            return
        } else {
            // If either username or password is invalid, send accessToken revoked message
            res.status(401).send({msg: "incorrect username or password"})
        }
    } catch (err) {
        console.log(err)
        // Handle errors appropriately
        res.status(500).send({ error: 'Internal server error' })
    }
}

// Middleware to authorize the user using JWT token
async function TokenAuthorization(req, res, next) {
    //Capture the JWT token and split it for authorization 
    try {
        const token = CaptureToken(req, res)
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
              // Handle error (e.g., invalid token, expired token)
              res.status(401).json({ message: 'Unauthorized' })
              return err
            } else {
              // Token is valid, proceed with the request
              req.decode = decoded
              next() // Allow request to proceed
              return
            }
          })
    
    } catch (err) {
        //res.clearCookie("token")
        console.log(err)
    }   
    }
    

//function to capture Tokens sent as request
function CaptureToken(req, res) {
    if (req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1]
        return token
} else {
    res.sendStatus(301)
}
}

// function to modify user credentials by updating the password
async function modifyCredentials(req, res, next) {
    try {
        const newPassword = req.body.requestedPassword;
        // Make sure newPassword exists
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        // Find the user by ID or any other unique identifier
        const user = await Admin.findOne()
        // Assuming you have the authenticated user stored in req.user
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        // Update the user's password
        user.password = hashedPassword;
        // Save the user
        await user.save();
        // Optionally, you can respond with a success message
        return res.status(200).json({ message: "Password updated successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


app.get('/', (req, res) => {
    try {
        CreateUserAdmin()
        console.log("done")
    } catch (error) {
        
    }
})
/* Routes related to Admin User */

// Admin Verification Route, checks for Token Authorization and responds
// For Dashboard verification
app.get('/admin/verification', TokenAuthorization, (req, res) => {

    // Verifies the authentication Token Flag
    if(req.decode.isAuthenticated) {
        // Sends a 200 ok status
        res.sendStatus(200);
        return;
    }
})

// Route to handle admin authorization
app.post('/admin/login', userAuthentication, async (req, res) => {
    try {
        const {username} = await getAdminData(res)
        // Generate JWT token for authentication
        const accessToken = jwt.sign({username, isAuthenticated: true}, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })
        // Respond with the cookie
        res.cookie("AUTHENTICATION_TOKEN", accessToken, {
            secure: true,
            domain: 'localhost', 
            sameSite: 'None',
            expires: 900000,
            maxAge: 900000
        })
        // sends an empty response
        res.send({})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Route to handle logout
app.post('/admin/logout', async (req, res) => {
    // Clear authentication cookie by setting its expiration date to a past date
    res.clearCookie('AUTHENTICATION_TOKEN', {
        secure: true, // Set to true if cookie was set with 'Secure' attribute
        httpOnly: true, // Set to true if cookie was set with 'HttpOnly' attribute
        sameSite: 'None' // Set to 'None' if cookie was set with 'SameSite' attribute
    })

    // Optionally, send a response indicating successful logout
    res.sendStatus(200)
})

// Route to handle password change
app.post('/admin/security/changeCredentials', // Break line for code clarity
TokenAuthorization, userAuthentication, modifyCredentials, async (req, res) => {
    // All routes managed by middlewares
    // Final Success Code
    console.log("Password updated successfully")
    res.sendStatus(200)
})

}