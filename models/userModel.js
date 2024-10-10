import mongoose from 'mongoose';
import Course from "./courseModel.js";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Course,
        required: false
    }],
    role: { type: String, required: true },
}, { minimize: false });

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;
