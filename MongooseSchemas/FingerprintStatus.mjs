import mongoose from "mongoose"

// student schema
const FingerprintStatusSchema = new mongoose.Schema({
    
    AllowRegistration: {
        type: Boolean,
        default: false
    }
})

const fingerPrintStatus = new mongoose.model('fingerprintStatus',FingerprintStatusSchema)

export default fingerPrintStatus
