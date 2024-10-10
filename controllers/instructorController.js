import courseModel from "../models/courseModel.js";

const addCourse = async (req, res) => {
    try {
        const { name, description, price, language, level, syllabus } = req.body;

        if (!name || !description || !price || !language || !level || !syllabus) {
            return res.status(400).json({success: false, message: 'Please enter valid course details'});
        }

        const user = req.user;
        if (user.role !== 'instructor') {
            return res.status(401).json({success: false, message: 'You are not an instructor!'});
        }

        const newCourse = await new courseModel({
            name,
            description,
            price,
            language,
            level,
            syllabus,
            instructor: req.user._id
        });

        await newCourse.save();
        res.status(201).json({ success: true, message: 'Course added successfully', course: newCourse });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export default addCourse;