import { createData, getData , getAllData , deleteData , deleteAllData , checkAndCreateDatabase} from "./Database/database.mjs"
import { createConnection } from "mysql2"
import express from 'express'

// Export a function that sets up the model
export default (app) => {
    
    /* Middlewares */
    
    // Use express.json middleware to parse JSON request bodies
    app.use(express.json())

    // Middleware to create the database if it doesn't exist
    app.use(async (req, res, next) => {
        const databaseName = 'university' // Change this to the desired database name
        await checkAndCreateDatabase(databaseName)
        next()
    })
    
    // Create a MySQL connection using the connection details from the environment variables
    const connection = createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
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
    
    /*Routes for managing attendance System*/
    
    // Route to get all data
    app.get("/daily_attendance", async(req,res) => {
        try {
            const attendance = await getAllData()
            res.send(attendance)
        } catch (error) {
            console.error('Error fetching data:', error)
            res.status(500).send('Internal Server Error')
        }
    })
    
    // Route to get data with a specific id
    app.get("/daily_attendance/:Qalam_Id", async (req, res) => {
        const id = req.params.Qalam_Id 
        const attendance = await getData(id)
        res.send(attendance)
    })
    
    // Route to create a new record
    app.post("/daily_attendance", async (req, res) => {
        const { Qalam_Id, Student_Name, Month_Number, ...days } = req.body
    
        try {
            const newAttendance = await createData(Qalam_Id, Student_Name, Month_Number, days)
            res.status(201).send(newAttendance)
        } catch (error) {
            console.error('Error posting data:', error)
            res.status(500).send('Internal Server Error')
        }
    })
    
    // Route to delete a specific record
    app.delete("/daily_attendance/:Qalam_Id",async (req, res) => {
        const id = req.params.Qalam_Id
        const attendance = await deleteData(id)
        res.send(attendance)
    
    })
    
    // Route to delete all records
    app.delete("/daily_attendance",async (req , res) => {
        const attendance = await deleteAllData()
        res.send(attendance)
    
    })
}
