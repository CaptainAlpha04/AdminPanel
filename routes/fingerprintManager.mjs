import fingerPrintStatus from "../MongooseSchemas/FingerprintStatus.mjs"
import express from 'express'
import dotenv from 'dotenv';
import Student from '../MongooseSchemas/studentSchema.mjs'
dotenv.config();

export default (app) => {

app.use(express.json())

// Middle ware to check Registration Status
async function checkRegistrationStatus(req, res) {
    const registrationStatus = await fingerPrintStatus.findOne()
    if (registrationStatus) {
        return true
    }
    else {
        return false
    }
}

// NodeMCU checks if it is able to access the server
app.post('/checkingConnection', checkHardwareToken, async (req, res) => {
    res.sendStatus(200)
})

// Allows the admin to enable new registration of fingerprints 
app.post('/fingerprint/allowNewRegistration', async (req, res) => {
    try {
        // Extracts and checks for existing status
        const status = req.body.registrationStatus
        let existingStatus = await fingerPrintStatus.findOne()

        if (existingStatus) {
            existingStatus.AllowRegistration = status;
            await existingStatus.save()
            console.log("fingerprint status already exists and is updated")
        } else {
            // If existing status does not exist, create a new field
            const newStatus = new fingerPrintStatus({ AllowRegistration: status })
            await newStatus.save()
            console.log("fingerprint status updated")
        }
    } catch (err) {
        console.log(err)
    }                   
})

//NodeMCU directs fingerprint id here for attendance after a scan match is found.
app.post('/FingerID::id', async (req, res) => {
    const id = req.params.id;

    const students = await Student.find({});    //querying for all student docs
    
    let studentFound = null;

    //for each student
    for (let student of students) {
        const splitFingerprintId = student.fingerprint_Id.split(".");    // Split the fingerprint_Id at the "."
        
        // checking if the second part of the fingerprint_Id matches the id from the fingerprint scanner
        if (splitFingerprintId[1] === id) {
            studentFound = student;
            break;
        }
    }
    
    if (studentFound) {
        console.log(`Got fingerprint ID: ${id}, Attendance marked for ${studentFound.username}!`);
        const responseObject = {
            username: studentFound.username,
            qalamId: studentFound.qalamId
        };
        res.json(responseObject); // Send a response back to Arduino
    } else {
        console.log(`No student found with fingerprint ID: ${id}`);
        res.status(404).send('No student found'); // Send a 404 status code
    }
});

// Middlewares related to the Fingerprint Management 

// Function to authorize the correct NodeMCU
async function checkHardwareToken(req, res, next) {
         
    // Extract the verification token from the request body
    const verificationToken = req.body.verificationToken
    const authenticationToken = verificationToken.split('.')[0]
    const hostelId = verificationToken.split('.')[1]

    try {
    if (authenticationToken === process.env.HARDWARE_TOKEN) {
        console.log("ESP8266-NodeMCU Authorized!")
        next()
    } else
        res.sendStatus(401).json({message: "Unauthorized"})
    } catch (err) {

    console.log(err)
    res.sendStatus(500).json({message: "Internal server error"})
    }
}

} 




