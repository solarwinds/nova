import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Post {
    @Field()
    _id: string;

    @Field()
    text: string;

    @Field({ nullable: true })
    votes: number;

    @Field()
    author: string; // ToDo: make it User

    @Field()
    creationDate: Date;

    @Field()
    lastUpdatedDate: Date;
}
