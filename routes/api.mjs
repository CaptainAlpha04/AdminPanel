import Complaints from '../schema/complaints.mjs'
import Queries from '../schema/queries.mjs'
import Mess from '../schema/messSchema.mjs'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv';

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.API_KEY)

async function GenerateQuote() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const prompt = `
    Generate a new random lesser know and motivational and inspiring quote with the format of 
    Quote~Author
    `
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text
  }
  
  

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
            const complaints = await Complaints.find({resolved: false})
            res.send(complaints).status(200)

        } catch (error) {
            res.sendStatus(400)
            console.log(error)
        }
    })

    app.post('/complaints/resolveComplaint/', async (req, res) => {
        try {
            const {title} = req.body
            const complaint = await Complaints.findOne({title: title})
            if(complaint) {
                complaint.resolved = true
                complaint.save()
                res.sendStatus(200)
            }

        } catch (error) {
            
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
            const queries = await Queries.find({
                response: {$exists: false}
            })
            res.send(queries).status(200)

        } catch (error) {
            res.sendStatus(400)
            console.log(error)
        }
    })

    app.post('/queries/queryRespond', async (req, res) => {
        try {
            const {title, queryResponse} = req.body
            const query = await Queries.findOne({title: title})
            if(query) {
                query.response = queryResponse
                query.save()
                res.sendStatus(200)
            }

        } catch (error) {
            console.log(error)
            res.send(400)
        }
    })

    app.get('/api/generateQuote', async(req, res) => {
        const generateContent = await GenerateQuote()
        const quote = generateContent.split('~')[0]
        const author = generateContent.split('~')[1]
        res.send({quote, author}).status(200)
    })
}