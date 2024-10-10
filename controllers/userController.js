import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import validator from "validator/index.js";
import courseModel from "../models/courseModel.js";
import instructorModel from "../models/instructorModel.js";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {})
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const foundEmail = await userModel.findOne({ email });
        if (foundEmail) {
            return res.status(401).json({ success: false, message: 'User already exists' });
        }

        if (!name) {
            return res.status(401).json({ success: false, message: 'Name is required' });
        }

        if (!validator.isEmail(email)) {
            return res.status(401).json({ success: false, message: 'Please enter a valid email' });
        }

        if (password.length < 8) {
            return res.status(401).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;
        if (role === 'instructor') {
            newUser = new instructorModel({
                name,
                email,
                password: hashedPassword,
                role
            });
        } else {
            newUser = new userModel({
                name,
                email,
                password: hashedPassword,
                role: 'user'
            });
        }

        const savedUser = await newUser.save();

        const token = createToken(savedUser._id);
        res.status(201).json({ success: true, token });

    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        let foundUser = await userModel.findOne({ email });
        if (!foundUser) {
            foundUser = await instructorModel.findOne({ email });
        }

        if (!foundUser) {
            return res.status(401).json({ success: false, message: 'Invalid user' });
        }

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (isMatch) {
            const token = createToken(foundUser._id);
            res.status(200).json({ success: true, token, role: foundUser.role });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
};


const buyCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        const foundCourse = await courseModel.findById(courseId);
        if (!foundCourse) {
            return res.status(404).json({success: false, message: 'Course not found'});
        }

        const user = req.user;
        if (user.courses && user.courses.includes(foundCourse._id)) {
            return res.status(400).json({ success: false, message: 'You already own this course' });
        }

        user.courses.push(foundCourse._id);
        await user.save();
        res.status(200).json({success: true, message: `Successfully purchased: ${foundCourse.name}`});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, buyCourse};