import { createData, getData, getAllData, deleteData, deleteAllData, checkAndCreateDatabase } from './Database/database.mjs'
import { createConnection } from 'mysql2'
import express from 'express'

export default (app) => {
    
    /* Middlewares */
    app.use(express.json())
    /*Routes for managing attendance System*/
    
    /* Route to get all data */
    app.get('/daily_attendance', async(req,res) => {
        try {
            const attendance = await getAllData()
            res.send(attendance)
        } catch (error) {
            console.error('Error fetching data:', error)
            res.status(500).send('Internal Server Error')
        }
    })
    
    /** 
     * Route to get data with a specific id
     */
    app.get('/daily_attendance/:Qalam_Id', async (req, res) => {
        const id = req.params.Qalam_Id 
        const attendance = await getData(id)
        res.send(attendance)
    })
    
    /**
     * Route to create a new record
     */
    // New tuple gets created in mysql , so this is working but not visible on thunderclient
    app.post("/daily_attendance", async (req, res) => {
        const { Qalam_Id, Student_Name, Month_Number, ...days } = req.body;
        try {
            const newAttendance = await createData(Qalam_Id, Student_Name, Month_Number, days);
            res.status(201).send(newAttendance);
        } catch (error) {
            console.error('Error posting data:', error);
            res.status(500).send('Internal Server Error');
    }
});
    /**
     * Route to delete a specific record
     */
    app.delete('/daily_attendance/:Qalam_Id',async (req, res) => {
        const id = req.params.Qalam_Id
        const attendance = await deleteData(id)
        res.send(attendance)
    })
    
    /**
     * Route to delete all records
     */
    app.delete('/daily_attendance',async (req , res) => {
        const attendance = await deleteAllData()
        res.send(attendance)
    })
}
