import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterVoteInput {
    @Field()
    postId: string;

    @Field()
    vote: number;
}
