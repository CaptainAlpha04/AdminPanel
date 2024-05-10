import Student from '../schema/studentSchema.mjs'
import {EventEmitter} from 'events'

const eventEmitter = new EventEmitter();
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

let newStudent = null;
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
        newStudent = student;

        

        eventEmitter.once('fingerprintUpdated', () => {
            res.sendStatus(200); // Send a 200 status code
        });
})

// Checks if a new student object has been submitted
app.post('/fingerprint/checkForNewStudent', async (req, res) => {
    //const status =  await checkRegistrationStatus(req, res); 
    // If a new student object exists, respond with the student's fingerprintID
    if (newStudent) {
        res.sendStatus(200);
        const fingerprint_Id = req.body.id;
        console.log(fingerprint_Id)
        const student = await Student.findOne({qalamId: newStudent.qalamId})
        if (student) {
            student.fingerprint_Id = student.qalamId + "." + fingerprint_Id;
            await student.save()
            console.log("fingerprintID updated")

            eventEmitter.emit('fingerprintUpdated')
        }
        newStudent = null;
    } else {
        // If no new student object exists, respond with 401
        res.sendStatus(401);
    }
})

}
