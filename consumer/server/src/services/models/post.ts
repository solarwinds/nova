import * as mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
    text: String,
    author: String, // ToDo: make it User
    votes: Number,
    creationDate: Date,
    lastUpdatedDate: Date,
});

export const postModel = mongoose.model("Post", postSchema);
