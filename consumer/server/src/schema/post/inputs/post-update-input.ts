import { Field, InputType } from "type-graphql";

@InputType()
export class PostUpdateInput {
    @Field()
    id: string;

    @Field()
    text: string;
}
