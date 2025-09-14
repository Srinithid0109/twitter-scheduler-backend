import { Router } from "express";
import Tweet from "../models/tweet";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// create tweet (schedule)
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { text, mediaUrl, scheduledFor } = req.body;
    if (!text || !scheduledFor) return res.status(400).json({ message: "Missing fields" });

    const tweet = new Tweet({
      text,
      mediaUrl,
      scheduledFor: new Date(scheduledFor),
      userId: req.user.id
    });
    await tweet.save();
    return res.json(tweet);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
});

// get user's tweets
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const tweets = await Tweet.find({ userId: req.user.id }).sort({ scheduledFor: -1 });
    return res.json(tweets);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
});

export default router;
