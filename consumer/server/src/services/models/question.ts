import * as mongoose from "mongoose";
import { Schema } from "mongoose";

export const questionSchema = new mongoose.Schema({
    title: String,
    tags: [String],
    acceptedAnswerPostId: String,
    questionPost: {type: Schema.Types.ObjectId, ref: "Post"},
    answerPosts: [{type: Schema.Types.ObjectId, ref: "Post"}],
    userVotes: [{type: Schema.Types.ObjectId, ref: "Vote"}],
});

export const questionModel = mongoose.model("Question", questionSchema);
