export default (app) => {

app.post('/fingerprint/register', (req, res) => { 
    console.log("finger print registered")
    res.sendStatus(200)
})
}