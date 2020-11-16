import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class UserPayload {

    @Field()
    public username: string;

    @Field(type => [String], { nullable: true})
    public roles?: string[];

}
