import Complaints from '../schema/complaints.mjs'
import Queries from '../schema/queries.mjs'
import Mess from '../schema/messSchema.mjs'

export default (app) => {

    // R
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

    app.post('/complaints/addComplaint', async (req, res) => {
        const { title, description } = req.body
        try {
            const complaint = await new Complaints({title, description, resolved: false})
            complaint.save()
            res.sendStatus(201)
            console.log('Complaint registered successfully')
        } catch (error) {
            res.sendStatus(400)
        }
    })

    app.get('/complaints/getAllComplaints', async (req, res) => {
        try {
            const complaints = await Complaints.find({})
            res.send(complaints).status(200)

        } catch (error) {
            res.sendStatus(400)
            console.log(error)
        }
    })

    app.post('/queries/addQuery', async (req, res) => {
        const { title, description } = req.body
        try {
            const query = await new Queries({title, description})
            query.save()
            res.sendStatus(201)
            console.log('Complaint registered successfully')
        } catch (error) {
            res.sendStatus(400)
        }
    })

    app.get('/queries/getAllQueries', async (req, res) => {
        try {
            const queries = await Queries.find({})
            res.send(queries).status(200)

        } catch (error) {
            res.sendStatus(400)
            console.log(error)
        }
    })

}