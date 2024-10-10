import courseModel from "../models/courseModel.js";

const addCourse = async (req, res) => {
    try {
        const { name, description, price, language, level, syllabus } = req.body;

        if (!name || !description || !price || !language || !level || !syllabus || !Array.isArray(syllabus)) {
            return res.status(400).json({success: false, message: 'Please enter valid course details, and ensure syllabus is an array'});
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

const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { name, description, price, language, level, syllabus } = req.body;

        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const user = req.user;
        if (user.role !== 'instructor' || course.instructor.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to update this course' });
        }

        course.name = name || course.name;
        course.description = description || course.description;
        course.price = price || course.price;
        course.language = language || course.language;
        course.level = level || course.level;
        course.syllabus = syllabus || course.syllabus;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { addCourse, updateCourse };