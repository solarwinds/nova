import { Field, InputType } from "type-graphql";

@InputType()
export class AddQuestionInput {
    @Field()
    title: string;

    @Field()
    text: string;

    @Field()
    author: string; // ToDo: make it User

    @Field(type => [String], {nullable: true, description: "Keywords, that can be used for search"})
    tags?: string[];
}
