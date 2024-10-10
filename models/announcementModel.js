import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    message: { type: String, required: true },
    videoUrl: { type: String, required: false }, // Make this optional
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export default Announcement;
