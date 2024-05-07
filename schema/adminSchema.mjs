import mongoose from "mongoose"

//schema for the top level admin

const adminSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        lowercase: true,
    },
    password: {
        type: String, 
    },
    image: {
        data: Buffer,
        contentType: String
    }
})

const Admin = mongoose.model('Admin', adminSchema)
export default Admin