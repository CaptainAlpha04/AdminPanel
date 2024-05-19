import mongoose from "mongoose";

const complaintsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    resolved: {
        type: Boolean,
        default: false,
    }, 
})

const Complaints = mongoose.model('Complaints', complaintsSchema)

export default Complaints