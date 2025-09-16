"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../models/Users"));
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ message: "Missing fields" });
        const existing = await Users_1.default.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already used" });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = new Users_1.default({ username, email, password: hashed });
        await user.save();
        return res.json({ message: "User registered" });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Missing fields" });
        const user = await Users_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Wrong password" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
        return res.json({ token });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
});
exports.default = router;
