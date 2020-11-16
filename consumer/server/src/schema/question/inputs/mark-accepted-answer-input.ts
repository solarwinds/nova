import { Field, InputType } from "type-graphql";

@InputType()
export class MarkAcceptedAnswerInput {

    @Field()
    public questionId: string;

    @Field(type => String, {nullable: true})
    public acceptedAnswerPostId: string;

}
