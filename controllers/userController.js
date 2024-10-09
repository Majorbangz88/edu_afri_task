import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import validator from "validator/es";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {})
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const foundEmail = await userModel.findOne({email});
        if (foundEmail) {
            return res.status(401).json({success: false, message: 'User already exists'});
        }

        if (!name) {
            return res.status(401).json({success: false, message: 'Name is required'});
        }

        if (!validator.isEmail(email)) {
            return res.status(401).json({success: false, message: 'Please enter valid email'});
        }

        if (password.length < 8) {
            return res.json({success: false, message: 'Password must be at least 8 characters'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        })

        const user = newUser.save();

        const token = createToken(user._id);
        res.status(201).json({success: true, token});
    } catch (error) {

    }

}

const loginUser = async (req, res) => {

}

const buyCourse = async (req, res) => {

}

export { registerUser, loginUser, buyCourse};