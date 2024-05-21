import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
// Import routes
import AdminRoute from './routes/admin.mjs'
import fingerprintManager from './routes/fingerprintManager.mjs'
import sqlModel from './Model/sqlModel.mjs'
import student from './routes/student.mjs'
import api from './routes/api.mjs'
import Student from './schema/studentSchema.mjs'
import hostel from './routes/hostel.mjs'
// Importing necessary modules
import { createConnection } from 'mysql2'
import { checkAndCreateDatabase } from './Model/Database/database.mjs'

// Load environment variables from .env file
dotenv.config()

//Checks and creates a Database
checkAndCreateDatabase().then(() => {
  console.log('Database check completed.')})
// Initialize Express app
const app = express()
// Use express.json middleware to parse JSON request bodies
app.use(express.json({limit: "10mb"})) 

// Use the routes
AdminRoute(app)
fingerprintManager(app)
sqlModel(app)
student(app)
hostel(app)
api(app)
// Set the port to listen on, fallback to 5000 if not specified in the environment
const PORT = process.env.PORT || 5000

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true')
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(error))
    
   // Create a MySQL connection using the connection details from the environment variables
   const connection = createConnection({
     host: process.env.MYSQL_HOST,
     user: process.env.MYSQL_USER,
     password: process.env.MYSQL_PASSWORD,
   })
   // Connect to the MySQL server
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err)
      return
    }
    console.log('Connected to MySQL')
  })
  
   // Handle any errors that occur during the connection
  connection.on('error', (err) => {
    console.error('MySQL error:', err)
  })
  
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
})
