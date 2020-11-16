import { Types } from "mongoose";
import { isArray } from "util";

import { PostUpdateInput } from "../schema/post/inputs/post-update-input";
import { Post } from "../schema/post/post";
import { AddQuestionInput } from "../schema/question/inputs/add-question-input";
import { DeleteAnswerInput } from "../schema/question/inputs/delete-answer-input";
import { MarkAcceptedAnswerInput } from "../schema/question/inputs/mark-accepted-answer-input";
import { AnswerInput } from "../schema/question/inputs/question-answer-input";
import { QuestionUpdateInput } from "../schema/question/inputs/question-update-input";
import { QuestionsInput } from "../schema/question/inputs/questions-input";
import { Question } from "../schema/question/question";
import { QuestionsPayload } from "../schema/question/questions-payload";
import { RegisterVoteInput } from "../schema/vote/inputs/register-vote-input";
import { Vote } from "../schema/vote/vote";

import { postModel } from "./models/post";
import { questionModel } from "./models/question";
import ObjectId = Types.ObjectId;
import { voteModel } from "./models/vote";

export class MongoDbService {

    private static _instance: MongoDbService = new MongoDbService();

    private constructor() {
        if (MongoDbService._instance) {
            throw new Error("Error: Instantiation failed: Use MongoDbService.getInstance() instead of new.");
        }

        MongoDbService._instance = this;
    }

    static getInstance(): MongoDbService {
        return MongoDbService._instance;
    }

    async getQuestions(input: QuestionsInput): Promise<QuestionsPayload | undefined> {
        const startAtElement = input.start > 0 ? input.start : 0;
        const amountToReturn = input.end > 0 && input.end > startAtElement ? input.end - startAtElement : "$total";
        const sortBy = input.sortBy === "date" ? "questionPost.creationDate" : "title";
        const sortDirection = input.direction === "desc" ? -1 : 1;
        const searchValue = input.searchValue || "";

        return questionModel.aggregate([
            {
                $match: {
                    "title": {
                        "$regex": new RegExp(searchValue, "i"),
                    },
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "questionPost",
                    foreignField: "_id",
                    as: "questionPost",
                },
            },
            {
                $unwind: {
                    path: "$questionPost",
                },
            },
            {
                $sort: {
                    [sortBy]: sortDirection,
                },
            },
            {
                $group: {
                    "_id": null,
                    "questions": {
                        "$push": "$$ROOT",
                    },
                    "total": {
                        "$sum": 1,
                    },
                },
            },
            {
                $project: {
                    total: 1,
                    questions: {
                        $slice: ["$questions", startAtElement, amountToReturn],
                    },
                },
            },
        ]).exec();
    }

    async getPosts(): Promise<Post[]> {
        throw new Error("Not implemented.");
    }

    async addQuestion(input: AddQuestionInput, userId: string): Promise<Question> {
        const now = new Date();
        const questionPost = new postModel({
            _id: new ObjectId(),
            text: input.text,
            votes: 0,
            author: input.author, // ToDo: make it User
            creationDate: now,
            lastUpdatedDate: now,
        });
        await questionPost.save();

        const question = new questionModel({
            title: input.title,
            tags: [],
            questionPost: questionPost._id,
            answerPosts: [],
        });

        const questionSaveResult = await question.save();

        return await this.getQuestion(questionSaveResult._id.toString(), userId);
    }

    async getQuestion(questionId: string, userId: string): Promise<Question> {
        const questionResult = await questionModel.aggregate([
            {
                $match: {
                    _id: new ObjectId(questionId),
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "questionPost",
                    foreignField: "_id",
                    as: "questionPost",
                },
            },
            {
                $unwind: {
                    path: "$questionPost",
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "answerPosts",
                    foreignField: "_id",
                    as: "answerPosts",
                },
            },
        ]).exec();

        if (!isArray(questionResult) || questionResult.length === 0) {
            return null;
        }

        if (userId) {
            const votes = [];
            for (const answerPost of questionResult[0].answerPosts) {
                const answerVote = (await voteModel.find({ userId: userId, postId: answerPost._id }).exec())[0];
                if (answerVote) {
                    votes.push(answerVote);
                }
            }
            const questionVote = (await voteModel.find({ userId: userId, postId: questionResult[0].questionPost._id }).exec())[0];
            if (questionVote) {
                votes.push(questionVote);
            }
            questionResult[0].userVotes = votes;
        }
        return questionResult[0];
    }

    async getQuestionsByTag(tag: string, userId: string): Promise<Question[] | undefined> {
        throw new Error("Not implemented.");
    }

    async updateQuestion(input: QuestionUpdateInput, userId: string): Promise<Question> {
        const updatedQuestion = await questionModel.findByIdAndUpdate(new ObjectId(input.id), {
            title: input.title,
            tags: input.tags,
        }).exec();

        await postModel.findByIdAndUpdate(
            new ObjectId(updatedQuestion.toObject().questionPost._id), {
                text: input.text,
            }).exec();

        return await this.getQuestion(input.id, userId);
    }

    async answerQuestion(input: AnswerInput, userId: string): Promise<Question> {
        const now = new Date();
        const answer = new postModel({
            _id: new ObjectId(),
            text: input.text,
            votes: 0,
            author: input.author,
            creationDate: now,
            lastUpdatedDate: now,
        });

        await answer.save();

        await questionModel.findByIdAndUpdate(new ObjectId(input.id), {
            $push: { answerPosts: answer._id },
        });

        return this.getQuestion(input.id, userId);
    }

    async markAcceptedAnswer(input: MarkAcceptedAnswerInput, userId: string): Promise<Question> {
        await questionModel.findByIdAndUpdate(new ObjectId(input.questionId), {
            acceptedAnswerPostId: input.acceptedAnswerPostId,
        }).exec();

        return await this.getQuestion(input.questionId, userId);
    }

    async deleteQuestion(id: string): Promise<boolean> {
        const question = await questionModel.findById(new ObjectId(id)).exec();

        await postModel.findByIdAndRemove(question["questionPost"]).exec();
        await postModel.remove({ _id: { $in: question["answerPosts"] } }).exec();
        await voteModel.remove({ postId: { $in: question["answerPosts"] } }).exec();
        await voteModel.remove({ postId: question["questionPost"] }).exec();
        await question.remove();

        return true;
    }

    async updatePost(input: PostUpdateInput): Promise<Post> {
        const updateResult = await postModel.findByIdAndUpdate(
            new ObjectId(input.id), {
                text: input.text,
                lastUpdatedDate: new Date(),
            }).exec();

        const post = await postModel.findById(updateResult._id).exec();

        return post.toObject();
    }

    async registerVote(input: RegisterVoteInput, userId: string): Promise<Vote> {
        const previousVote = (await voteModel.find({ userId: userId, postId: input.postId }).exec())[0];
        
        await voteModel.findOneAndUpdate({
                userId: userId,
                postId: input.postId,
            },
            {
                vote: input.vote,
            },
            {
                upsert: true,
            }
        ).exec();

        const voteDelta = input.vote - (previousVote ? previousVote["vote"] : 0);
        const post = await postModel.findById(new ObjectId(input.postId)).exec();
        await postModel.findByIdAndUpdate(
            new ObjectId(input.postId), {
                votes: post["votes"] + voteDelta,
            }).exec();

        const currentVote = (await voteModel.find({ userId: userId, postId: input.postId }).exec())[0];
        return currentVote.toObject();
    }

    async getUserVotes(userId: string): Promise<Vote[]> {
        const result = await voteModel.aggregate([
            {
                $match: {
                    userId: userId,
                },
            }]).exec();

        return result || [];
    }

    async deleteAnswer(input: DeleteAnswerInput, userId: string): Promise<Question> {
        await voteModel.remove({ postId: input.answerId }).exec();
        await postModel.findByIdAndRemove(new ObjectId(input.answerId)).exec();

        const question = await questionModel.findByIdAndUpdate(new ObjectId(input.questionId), {
            $pull: { answerPosts: input.answerId },
        });

        if (question["acceptedAnswerPostId"] === input.answerId) {
            await questionModel.findByIdAndUpdate(new ObjectId(input.questionId), {
                acceptedAnswerPostId: "",
            });
        }

        return await this.getQuestion(input.questionId, userId);
    }
}
