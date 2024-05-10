import { mysqlPool, calculateTotalDays, calculatePresent, calculateLeaves, retrieveAllIds, deleteAllData } from './database.mjs'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cron from 'node-cron'

dotenv.config()

// Set up MongoDB connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.mongodb.net/`)

// Define MongoDB schema
const monthlyAttendanceSchema = new mongoose.Schema({
    Qalam_Id: {
        type: Number,
        required: true,
        unique: true
    },
    Total_Days: {
        type: Number,
        required: true
    },
    Present_Days: {
        type: Number,
        required: true
    },
    Leave_Days: {
        type: Number,
        required: true
    },
    Image: {
        type: Blob
    }
})

// Define MongoDB model
const MonthlyAttendance = mongoose.model('MonthlyAttendance', monthlyAttendanceSchema)

// Function to transfer data from MySQL to MongoDB
async function transferData() {
    try {
        const allQalamIds = await retrieveAllIds("daily_attendance","daily_attendance")

        for (const qalamId of allQalamIds) {
            const totalDays = await calculateTotalDays("daily_attendance", qalamId, "daily_attendance")
            const presentDays = await calculatePresent("daily_attendance", "daily_attendance", qalamId, totalDays)
            const leaveDays = await calculateLeaves("daily_attendance", "daily_attendance", qalamId, totalDays)

            await MonthlyAttendance.create({
                Qalam_Id: qalamId,
                Total_Days: totalDays,
                Present_Days: presentDays,
                Leave_Days: leaveDays
            })

            console.log(`Data transferred successfully for Qalam ID ${qalamId}`)
        }

        
        // After transferring data, check if MongoDB has received all the data
        const countInMongoDB = await MonthlyAttendance.countDocuments()
        console.log(`Total documents in MongoDB: ${countInMongoDB}`)

        // If MongoDB has received the data, delete records of the previous month from MySQL
        if (countInMongoDB === allQalamIds.length) {
            await deleteAllData()
        }

    } catch (error) {
        console.error('Error transferring data:', error)
    } finally {
        mongoose.connection.close()
    }
}

//  Function to get the current date of the Month
const currentDate = new Date()
const dayOfMonth = currentDate.getDate()
console.log(dayOfMonth)

// this line is for testing purpose, transfers data every 10 secs
//cron.schedule('*/10 * * * * *',transferData)

// Schedule the data transfer task to run at the end of every month
cron.schedule(`0 0 ${dayOfMonth} * *`, transferData)