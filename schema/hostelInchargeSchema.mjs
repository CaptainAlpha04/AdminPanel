import mongoose from "mongoose"

// Manager and caretaker's schema

const hostelInchargeSchema = new mongoose.Schema({

    username: String,
    hostelName: String,
    role: String,
    phoneNumber:Number,
    CNIC: Number,

    email:{
        type: String,
        lowercase: true,
    },
    
    password: {
        type: String
    }

});

const HostelIncharge = new mongoose.model('HostelIncharge',hostelInchargeSchema)

export default HostelIncharge