import { Field, InputType } from "type-graphql";

@InputType()
export class AnswerInput {
    @Field()
    id: string;

    @Field()
    text: string;

    @Field()
    author: string; // ToDo: make it User
}
