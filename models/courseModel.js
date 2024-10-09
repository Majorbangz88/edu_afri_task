import mongoose from 'mongoose';
import Instructor from "./instructorModel.js";

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Instructor,
        required: true
    }
});

const courseModel = mongoose.model('Course', courseSchema);

export default courseModel;
