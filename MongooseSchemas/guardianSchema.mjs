import mongoose from "mongoose"

// schema for parents/guardian

const guardianSchema = new mongoose.Schema({

    username: String,
    realtion: String,
    phoneNumber:Number,
    CNIC: Number,

    email:{
        type: String,
        lowercase: true,
    },
    
    password: {
        type: String,
    },

    childInformation: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }
});

const Guardian = new mongoose.model('Guardian',guardianSchema)

export default Guardian

