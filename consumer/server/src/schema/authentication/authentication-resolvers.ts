import * as jsonwebtoken from "jsonwebtoken";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import { Constants } from "../../constants";
import { Context } from "../../context";
import { userDatabase } from "../../user-database";

import { AuthenticationInput } from "./authentication-input";
import { UserPayload } from "./user-payload";

@Resolver(objectType => UserPayload)
export class AuthenticationResolver {

    @Mutation(returns => UserPayload)
    async login(@Arg("input", type => AuthenticationInput) input: AuthenticationInput,
                @Ctx() context: Context) {
        const user = userDatabase[input.username];

        if (!user) {
            throw new Error();
        }

        const valid = input.password === user.password;

        if (!valid) {
            throw new Error();
        }

        console.log("Login successful:", user.username);

        // return json web token
        const token = jsonwebtoken.sign(
            {
                username: user.username,
            },
            "secret",
            {expiresIn: "1d"}
        );

        context.response.cookie(Constants.AUTHENTICATION_COOKIE_NAME, token, {
            httpOnly: true,
            secure: false, // process.env.NODE_ENV == "production"
            maxAge: 1000 * 60 * 60 * 24, // 1d
        });

        return {
            username: user.username,
            roles: user.roles,
        };
    }

    @Mutation(returns => Boolean)
    async logout(@Ctx() context: Context): Promise<boolean> {
        context.response.clearCookie(Constants.AUTHENTICATION_COOKIE_NAME);
        console.log("Logout successful!");
        return true;
    }

}
