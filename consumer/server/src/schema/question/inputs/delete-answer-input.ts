import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteAnswerInput {

    @Field()
    public questionId: string;

    @Field()
    public answerId: string;

}
