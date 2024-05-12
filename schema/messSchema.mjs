import mongoose from 'mongoose';

const messSchema = new mongoose.Schema({

    messData : [
        {
            type: [String],
            required: true
        }
    ]
});

const Mess = new mongoose.model('Mess', messSchema);

export default Mess;