import mongoose from "mongoose"

// Schema for hostels

const hostelSchema = new mongoose.Schema({

    hostelName: {
        type: String,
        required: true
    },
    managerName: {
        type: String,
        required: true
    },
    numberOfFloors: {
        type: Number,
        required: true
    },
    numberOfRooms: {
        type: Number,
        required: true
    },
    totalStudents: {
        type: Number,
        required: true
    }
})

const Hostel = new mongoose.model('Hostel',hostelSchema)

export default Hostel