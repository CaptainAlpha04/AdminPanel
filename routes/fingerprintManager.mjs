import fingerPrintStatus from "../MongooseSchemas/FingerprintStatus.mjs"
import express from 'express'

export default (app) => {

/* Express Middlewares  */

app.use(express.json())

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

app.post('/fingerprint/register', checkHardwareToken ,async (req, res) => {
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

// Checks if the fingerprint registration is allowed

app.post('/fingerprint/registerNewUser', async (req, res) => {
   const status =  await checkRegistrationStatus(req, res);
   
   if (status) {
         res.sendStatus(200)
   } else {
        res.sendStatus(401)
   }
 })
}