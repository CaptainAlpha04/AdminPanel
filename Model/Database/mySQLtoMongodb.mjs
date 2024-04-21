import cron from 'node-cron'
import { mongooseConnection } from '../../MongooseSchemas/attendanceSheet.mjs'
import { Attendance } from './attendance_sheet.mjs'
import { getAllData , deleteAllData, mysqlPool } from './database.mjs'

// SQL query to get current month's attendance data
const getCurrentMonthAttendanceQuery = `
    SELECT * 
    FROM attendance_table 
    WHERE Month_Number = MONTH(CURRENT_DATE())
`

// Function to transfer data from MySQL to MongoDB
async function transferDataToMongoDB() {
    try {
        // Retrieve attendance data from MySQL
        const [rows] = await getAllData()
        
        // Insert retrieved data into MongoDB
        await Attendance.insertMany(rows)

        console.log('Data transferred to MongoDB successfully.')
    } catch (error) {
        console.error('Error transferring data to MongoDB:', error)
    }
}

// Function to delete data of the previous month from MySQL
async function deletePreviousMonthDataFromMySQL() {
    try {
        // Get the current month
        const currentMonth = new Date().getMonth() + 1 // JavaScript months are zero-based

        // Calculate the previous month
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1

        // Delete data of the previous month from MySQL
        await deleteAllData()

        console.log('Previous month data deleted from MySQL.')
    } catch (error) {
        console.error('Error deleting previous month data from MySQL:', error)
    }
}

// Schedule the task to run on the last day of every month
const job = cron.schedule('*/5 * * * * *', async () => {
    console.log('Running data transfer and deletion task on the last day of the month...')
    await transferDataToMongoDB()
    await deletePreviousMonthDataFromMySQL()
})

// Stop the cron job after 5 seconds
setTimeout(() => {
    job.stop()
    console.log('Cron job stopped after 5 seconds.')
}, 5000) // Stop after 5 seconds (5000 milliseconds)

// Function to retrieve data from MongoDB
async function retrieveDataFromMongoDB() {
    try {
        // Find all documents in the collection
        const data = await Attendance.findMany()

        // Log the retrieved data
        console.log('Retrieved data from MongoDB:', data)
    } catch (error) {
        console.error('Error retrieving data from MongoDB:', error)
    }
}

// Call the function to retrieve data
retrieveDataFromMongoDB()

// Start the application
console.log('Application started.')
