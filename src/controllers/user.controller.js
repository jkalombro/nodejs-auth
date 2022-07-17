import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Return from '../utils/Return.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return Return.notFound(res, "User doesn't exist.");
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return Return.invalid(res, 'Invalid credentials.');

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_KEY, { expiresIn: '1h' });
        Return.success(res, { result: existingUser, token });
    } catch (err) {
        Return.error500(res, err.message);
    }
};

export const signup = async (req, res) => {
    const { email, password, confirmedPassword, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return Return.invalid(res, 'User already exist.');
        if (password !== confirmedPassword) return Return.invalid(res, "Passwords don't match.");

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_KEY, { expiresIn: '1h' });
        Return.success(res, { result, token });
    } catch (err) {
        Return.error500(res, err.message);
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return Return.notFound(res, 'Invalid ID');
        const userExists = await User.exists({ _id: id });
        if (!userExists) return Return.notFound(res, 'User not found');
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });

        Return.success(res, updatedUser);
    } catch (err) {
        Return.error500(res, err.message);
    }
};
