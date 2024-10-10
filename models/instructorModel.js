import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
}, { minimize: false });

const instructorModel = mongoose.model('Instructor', instructorSchema);

export default instructorModel;