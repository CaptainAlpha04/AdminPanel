import mongoose from "mongoose"

// schema for secondary admin(headOffice) 

const headOfficeSchema = new mongoose.Schema({

    username: String,
    phoneNumber:Number,

    email:{
        type: String,
        lowercase: true,
    },
    
    password:{
        type: String
    }
});

const HeadOffice = new mongoose.model('HeadOffice',headOfficeSchema)

export default HeadOffice