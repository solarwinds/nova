import { Field, InputType } from "type-graphql";

@InputType()
export class  QuestionsInput {
    @Field({ nullable: true })
    searchValue?: string;

    @Field({ nullable: true })
    start?: number;
    
    @Field({ nullable: true })
    end?: number;

    @Field({ nullable: true })
    sortBy?: string;
    
    @Field({ nullable: true })
    direction?: string;
}
