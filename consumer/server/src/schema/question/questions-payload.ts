import { Field, ObjectType } from "type-graphql";

import { Question } from "./question";

@ObjectType()
export class QuestionsPayload {
    
    @Field({ nullable: true })
    total: number;

    @Field(type => [Question], { nullable: true })
    questions: Question[];
}
