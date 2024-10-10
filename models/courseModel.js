import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    language: { type: String, required: true },
    level: { type: Number, required: true },
    syllabus: { type: Array, default: [] },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    }
});

const courseModel = mongoose.model('Course', courseSchema);

export default courseModel;
