import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import instructorModel from "../models/instructorModel.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let foundUser = await userModel.findById(decoded.id);

        if (!foundUser) {
            foundUser = await instructorModel.findById(decoded.id);
        }

        if (!foundUser) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = foundUser;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

export default authMiddleware;
