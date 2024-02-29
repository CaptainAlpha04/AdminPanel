import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        lowercase: true,
    },
    password: {
        type: String, 
    }
})

const Admin = mongoose.model('Admin', adminSchema)
export default Admin