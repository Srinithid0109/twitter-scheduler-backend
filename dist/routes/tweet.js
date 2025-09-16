"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Tweet_1 = __importDefault(require("../models/Tweet"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// create tweet (schedule)
router.post("/", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { text, mediaUrl, scheduledFor } = req.body;
        if (!text || !scheduledFor)
            return res.status(400).json({ message: "Missing fields" });
        const tweet = new Tweet_1.default({
            text,
            mediaUrl,
            scheduledFor: new Date(scheduledFor),
            userId: req.user.id
        });
        await tweet.save();
        return res.json(tweet);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
});
// get user's tweets
router.get("/", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const tweets = await Tweet_1.default.find({ userId: req.user.id }).sort({ scheduledFor: -1 });
        return res.json(tweets);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
});
exports.default = router;
