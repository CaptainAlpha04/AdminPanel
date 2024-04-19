export default (app) => {

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

/* Route for testing purposes!
*  This route will be used to register a finger print
*   Use this route to test if the server is running
*/
app.post('/', (req, res) => { 
    console.log("finger print registered")
    res.sendStatus(200).json({message: "Finger print registered"})
})

/* Actual Routes related to fingerprint */

app.post('/fingerprint/register', checkHardwareToken ,async (req, res) => {
    console.log("fingerprint registered");
    res.sendStatus(200)
})

}