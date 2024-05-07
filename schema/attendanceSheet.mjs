import  mongoose  from "mongoose";
import {getData, createData} from "../Model/Database/database.mjs";
import dotenv from "dotenv"
dotenv.config();


// MongoDB Atlas connection options
const options = {
    user: process.env.dbUser,
    pass: process.env.dbPassword
  };

const uri = `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster1.1f6q7yz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

console.log("URI:", uri);
console.log("Options:", options);


mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });

export const mongooseConnection = mongoose.connection;

  // schema for storing monthly attendance

const dailyAttendanceSchema = new mongoose.Schema({

    Qalam_Id: {
        type: Number,
        required: true
    },

    Student_Name: {
        type: String,
        required: true
    },

    Month_Number: {
        type: Number,
        required: true
    },

    Day_1: {
        type: String,
        required: true
    },

    Day_2: {
        type: String,
        required: true
    },

    Day_3: {
        type: String,
        required: true
    },

    Day_4: {
        type: String,
        required: true
    },

    Day_5: {
        type: String,
        required: true
    },

    Day_6: {
        type: String,
        required: true
    },

    Day_7: {
        type: String,
        required: true
    },

    Day_8: {
        type: String,
        required: true
    },

    Day_9: {
        type: String,
        required: true
    },

    Day_10:{
        type: String,
        required: true
    },

    Day_11: {
        type: String,
        required: true
    },

    Day_12: {
        type: String,
        required: true
    },

    Day_13: {
        type: String,
        required: true
    },

    Day_14: {
        type: String,
        required: true
    },

    Day_15: {
        type: String,
        required: true
    },

    Day_16: {
        type: String,
        required: true
    },

    Day_17: {
        type: String,
        required: true
    },

    Day_18: {
        type: String,
        required: true
    },

    Day_19: {
        type: String,
        required: true
    },

    Day_20: {
        type: String,
        required: true
    },

    Day_21: {
        type: String,
        required: true
    },

    Day_22: {
        type: String,
        required: true
    },

    Day_23: {
        type: String,
        required: true
    },

    Day_24: {
        type: String,
        required: true
    },

    Day_25: {
        type: String,
        required: true
    },

    Day_26: {
        type: String,
        required: true
    },

    Day_27: {
        type: String,
        required: true
    },

    Day_28: {
        type: String,
        required: true
    },
    
    Day_29: String,
    Day_30: String,
    Day_31: String
});

export const Attendance = new mongoose.model("Attendance",dailyAttendanceSchema);


/*async function main(){
    try{

        // reading data from a collection
        //const data = await Attendance.find({Qalam_Id:454609});
        //console.log(data);
    }
    catch(error){
       console.log(error); 
    }
    finally{
        mongoose.connection.close();
    }
}

main();
*/


