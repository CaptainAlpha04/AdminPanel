import Hostels from '../schema/hostelSchema.mjs'
import Student from '../schema/studentSchema.mjs'

export default(app) => {
    
    app.post('/hostels/addHostel', async (req, res) => {
        const { hostelName, totalStudents, managerName, numberOfFloors, numberOfRooms} = req.body
        try {
            const hostel = await new Hostels({hostelName, totalStudents, managerName, numberOfFloors, numberOfRooms})
            hostel.save()
            res.sendStatus(201)
            console.log("Hostel data saved")
        } catch (error) {
            res.sendStatus(400)
            console.log(error)
        }
    })

    app.get('/hostels/getHostelData', async (req, res) => {
        try {
            const hostels = await Hostels.find({})
            res.send(hostels).status(200)
        } catch (error) {
            res.sendStatus(400)
            console.log(error)
        }
    })

    app.get('/hostels/getStudentDistribution', async (req, res) => {
        // make an aggregate function to get the total number of students per school of the students
        try {
            const studentDistribution = await Student.aggregate([
                {
                    $group: {
                        _id: "$school",
                        // there is no field for number of students in the student schema so check the school in which each student is in and get the total number of students in that school

                        totalStudents: {$sum: 1}
                    }
                }
            ])
            res.send(studentDistribution).status(200)
        } catch (error) {
            res.sendStatus(400)
            console.log(error)
        }
    })
}