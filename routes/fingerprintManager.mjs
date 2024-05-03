import fingerPrintStatus from "../MongooseSchemas/FingerprintStatus.mjs"
import express from 'express'
import dotenv from 'dotenv';
import Student from '../MongooseSchemas/studentSchema.mjs'
dotenv.config();

export default (app) => {

/* Express Middlewares  */

app.use(express.json())
app.use(express.text())
/* Middlewares related to the Fingerprint Management */

async function checkHardwareToken(req, res, next) {
         
    // Extract the verification token from the request body
    const verificationToken = req.body.verificationToken
    const authenticationToken = verificationToken.split('.')[0]
    const hostelId = verificationToken.split('.')[1]

    try {
    if (authenticationToken === process.env.HARDWARE_TOKEN)
        next()
    else
        res.sendStatus(401).json({message: "Unauthorized"})
    } catch (err) {

    console.log(err)
    res.sendStatus(500).json({message: "Internal server error"})
    }
}

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

/* Actual Routes related to fingerprint */

// Checks if the hardware is able to access the server
app.post('/fingerprint/register', async (req, res) => {
    console.log("Hardware is able to access the server")
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

 
//  //Check if a new Student object has been submitted, if yes store it in the newStudent.
//  app.post('/fingerprint/getNewStudentID', (req, res) => {
//     // req.body now contains the JavaScript object
//     const student = req.body;

//     // You can now access properties of the student object
//     console.log(student.username);
//     console.log(student.CNIC);
//     console.log(student.phoneNumber);

//     res.status(200).send('Student data received');
// });
}




