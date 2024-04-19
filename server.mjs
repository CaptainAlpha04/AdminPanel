import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

// Import routes
import AdminRoute from './routes/admin.mjs'
import fingerprintManager from './routes/fingerprintManager.mjs'
// Load environment variables from .env file
dotenv.config()

// Initialize Express app
const app = express()

// Use the routes
AdminRoute(app)
fingerprintManager(app)
// Set the port to listen on, fallback to 5000 if not specified in the environment
const PORT = process.env.PORT || 5000

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true')
    .then(() => console.log('Connected to DB'))
    .catch(error => console.log(error))


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
