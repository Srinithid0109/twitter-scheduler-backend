import mongoose, { Schema, Document } from "mongoose";

export interface ITweet extends Document {
  text: string;
  mediaUrl?: string;
  scheduledFor: Date;
  status: string;
  userId: mongoose.Types.ObjectId;
}

const tweetSchema = new Schema<ITweet>(
  {
    text: { type: String, required: true, maxlength: 280 },
    mediaUrl: String,
    scheduledFor: { type: Date, required: true },
    status: { type: String, default: "scheduled" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model<ITweet>("Tweet", tweetSchema);
