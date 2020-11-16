import { Field, InputType } from "type-graphql";

@InputType()
export class AuthenticationInput {

    @Field({nullable: true})
    public username?: string;

    @Field({nullable: true})
    public password?: string;

}
