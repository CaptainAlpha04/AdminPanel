import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../schema/adminSchema.mjs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()
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
        password: (await bcrypt.hash("pass", 10)).toString(),
        email: "sfahmed.bscs23seecs@seecs.edu.pk"
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

/* Node Mailer Middleware and functions for reset Password Routes */

// Transporter function for nodemailer authentication
const transporter = nodemailer.createTransport({
    service: "Gmail", // "gmail
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.NODEMAILERUSER,
      pass: process.env.NODEMAILERPASS,
    },
  })

// Function to send OTP to the user's email

async function sendOTP(userEmail, otp) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Team Persona" <{${process.env.NODEMAILERUSER}}>`, // sender address
      to: `${userEmail}, ${userEmail}`, // list of receivers
      subject: "OTP Request for Password Reset", // Subject line
      text: `The OTP for your password reset is ${otp}`, // plain text body
    })
  
    console.log("Message sent: %s", info.messageId)
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

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

// Test route to create default admin user  
app.get('/admin/createAdmin', async (req, res) => {
    try {
        await CreateUserAdmin()
        res.send({response: "Admin Created"})
    } catch (error) {
        console.log(error)
        res.send({response: "Error Creating Admin"})
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

// Routes to handle password reset

// OTP Request flag
let enableOtpRequest = false

// OTP variable
let otp = 0
// Initial route to handle password reset request
app.post('/admin/forgetPassword', async (req, res) => {
    // Retrieve the user's email address from the request body
    const { email } = req.body;
    // Find the user by email address
    const user = await Admin.findOne({ email });
    if(user) {
        res.sendStatus(200)
        enableOtpRequest = true;
        otp = Math.floor(1000 + Math.random() * 9000)
        console.log(otp)
        sendOTP(email, otp).catch(console.error);
    } else {    
        res.sendStatus(401)
    }
})

// OTP Verification flag
let otpVerified = false
// Route to handle OTP verification
app.post('/admin/forgetPassword/otp', async (req, res) => {
    if(enableOtpRequest) {
        const { otpRequest } = req.body;
        if(otpRequest == otp) {
            res.sendStatus(200)
            console.log("OTP Verified")
            otpVerified = true
        } else {
            res.sendStatus(401)
            console.log('OTP Verification Failed')
            otpVerified = false
        }
    }
})

// Route to handle password reset
app.post('/admin/forgetPassword/reset', async (req, res) => {
    if(otpVerified) {
        const { newPassword } = req.body;
        if(newPassword) {
            const user = await Admin.findOne()
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            user.password = hashedPassword
            await user.save()
            res.sendStatus(200)
            console.log("Password Reset Successful")
        } else {
            res.sendStatus(401)
            console.log("Password Reset Failed")
        }
    }
})

}