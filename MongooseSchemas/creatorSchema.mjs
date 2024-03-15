import mongoose from "mongoose"

// schema for creators (us)

const creatorSchema = new mongoose.Schema({
    
    username: String,
    phoneNumber:Number,

    email:{
        type: String,
        lowercase: true,
    },

    password:{
        type: String,
    }
});

const Creator = new mongoose.model('Creator',creatorSchema)

export default Creator