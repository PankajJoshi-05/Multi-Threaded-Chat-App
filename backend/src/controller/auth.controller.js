import { generateToken } from "../utils/generateToken.utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });
        await newUser.save();

        generateToken(newUser._id, res);

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        generateToken(existingUser._id, res);
        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).send({ message: "server error", error });
    }
};

export const logout = (req, res) => {
    res.cookie("jwt","");
    return res.status(200).json({ message: "Logged out successfully" });
};
