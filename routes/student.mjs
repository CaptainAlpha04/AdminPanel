import Student from '../MongooseSchemas/studentSchema.mjs'

/* Exporting the Package to server */
export default (app) => {

/* Middlewares related to students */

async function checkIfStudentExists(req, res, next) {
    // Check if the student exists in the database
    const qalamId = req.body.qalamId
    const student = await Student.findOne({qalamId: qalamId})
    if(student) {
        res.status(400).send('Student Already Exists!')
    } else {
        next()
    }
    return
}
/* Routes related to students */
    app.post('/student/addNewStudent', checkIfStudentExists, async (req, res) => {
    // Parsing request body
        const {username, CNIC, phoneNumber, school, department, qalamId} = req.body
        // Add the student to the database
        const student = new Student({
            username,
            CNIC,
            phoneNumber,
            school,
            department,
            qalamId
        })
        //Saves the student record
        await student.save()
})

}
