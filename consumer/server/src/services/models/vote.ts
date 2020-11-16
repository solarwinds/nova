import * as mongoose from "mongoose";

export const voteSchema = new mongoose.Schema({
    postId: String,
    userId: String,
    vote: Number,
});

export const voteModel = mongoose.model("Vote", voteSchema);
