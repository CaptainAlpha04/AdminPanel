import mongoose from "mongoose"

// schema for club admins

const clubAdminSchema = new mongoose.Schema({
    
    username: String,
    clubName: String,
    role: String,
    profile: String,
    CNIC: Number,

    email:{
        type: String,
        lowercase: true,
    },

    password: {
        
        typt: String
    }
});

const ClubAdmin = new mongoose.model('ClubAdmin',clubAdminSchema)

export default ClubAdmin