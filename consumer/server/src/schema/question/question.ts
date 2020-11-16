import { Field, ObjectType } from "type-graphql";

import { Post } from "../post/post";
import { Vote } from "../vote/vote";

@ObjectType()
export class Question {
    @Field()
    _id: string;

    @Field()
    title: string;

    @Field(type => [String], {nullable: true, description: "Keywords, that can be used for search"})
    tags?: string[];

    @Field(type => String, {nullable: true})
    acceptedAnswerPostId?: string;

    @Field()
    questionPostId: string;

    @Field()
    questionPost: Post;

    @Field(type => [String], {nullable: true})
    answerPostIds?: string[];

    @Field(type => [Post])
    answerPosts: Post[];

    @Field(type => [Vote], { nullable: true })
    userVotes?: Vote[];
}
