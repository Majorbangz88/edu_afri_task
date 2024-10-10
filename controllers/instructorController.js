import courseModel from "../models/courseModel.js";

const addCourse = async (req, res) => {
    try {
        const { name, description, price, language, videoLength, level, syllabus } = req.body;

        if (!name || !description || !price || !language || !videoLength || !level || !Array.isArray(syllabus)) {
            return res.status(400).json({success: false, message: 'Please enter valid course details, and ensure syllabus is an array'});
        }

        for (const item of syllabus) {
            if (!item.week || !item.content || !item.content.title) {
                return res.status(400).json({success: false, message: 'Each syllabus item must include a week and content with a title'});
            }
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
            videoLength,
            level,
            syllabus,
            instructor: req.user._id
        });

        await newCourse.save();
        res.status(201).json({ success: true, message: `Course ${name} added successfully`, course: newCourse });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { name, description, price, language, videoLength, level, syllabus } = req.body;

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
        course.videoLength = videoLength || course.videoLength;
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

const findCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, message: 'Course id is required!' });
        }

        const foundCourse = await courseModel.findById(courseId)
        if (!foundCourse) {
            return res.status(404).json({ success: false, message: 'Course not found!' });
        }
        return res.status(201).json({success: true, foundCourse});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const findCourseByName = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Course name is required!' });
        }

        const foundCourse = await courseModel.findOne({name});
        if (!foundCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        return res.status(201).json({success: true, foundCourse});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ success: false, message: 'Course ID is required' });
        }

        const foundCourse = await courseModel.findById(courseId);
        if (!foundCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        await courseModel.findByIdAndDelete(courseId);
        res.json({ success: true, message: 'Course removed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const deleteCourseByName = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Course name is required!' });
        }

        const foundCourse = await courseModel.findOneAndDelete({name});
        if (!foundCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        return res.json({ success: true, message: `Course ${name} removed successfully` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


export { addCourse, updateCourse, findCourse, findCourseByName, deleteCourse, deleteCourseByName };