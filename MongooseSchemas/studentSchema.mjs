import mongoose from "mongoose"

// student schema
const studentSchema = new mongoose.Schema({
    
    username: String,
    School: String,
    Department: String,
    qalamId: Number,
    hostelName:String,
    phoneNumber:Number,
    fingerprint_Id: String,
    absentDays: Number,
    presentDays: Number,
    totalDays: Number,
    CNIC: Number,
    email:{
        type: String,
        lowercase: true,
    },

    password: {
        type: String,
    },

    guardian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guardian'
    },

    image: {
        type: Blob
    }

});

const Student = new mongoose.model('Student',studentSchema)

export default Student
