import { Field, InputType } from "type-graphql";

@InputType()
export class QuestionUpdateInput {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @Field(type => [String], {nullable: true, description: "Keywords, that can be used for search"})
    tags?: string[];
}
