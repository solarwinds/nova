import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Vote {
    @Field()
    _id: string;

    @Field()
    postId: string;

    @Field({ nullable: true })
    vote: number;
}
