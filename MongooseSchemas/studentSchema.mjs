import mongoose from "mongoose"


// student schema
const studentSchema = new mongoose.Schema({
    
    username: String,
    School: String,
    Department: String,
    qalamId: Number,
    hostelName:String,
    phoneNumber:Number,
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
    }

});

const Student = new mongoose.model('Student',studentSchema)

export default Student
