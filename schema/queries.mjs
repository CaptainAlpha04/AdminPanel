import mongoose from "mongoose";

const queriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    response: {
        type: String
    }
})

const Queries = mongoose.model('Queries', queriesSchema)

export default Queries;