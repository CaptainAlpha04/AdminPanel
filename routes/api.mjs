import Mess from '../schema/messSchema.mjs'

export default (app) => {

    app.post('/api/mess', async (req, res) => {
        const { period } = req.body
        try {
            const mess = await new Mess({messData: period})
            mess.save()
            res.sendStatus(200)
            console.log("mess data saved")
        } catch (error) {
            res.sendStatus(400)
        }
        
    })

    app.get('/api/messData', async (req, res) => {
        try {
            const mess = await Mess.findOne()
            res.send(mess)
            console.log("mess data send")
        } catch (error) {
            res.sendStatus(400)
        }
})

}