import * as cookieParser from "cookie-parser";
import { Request } from "express";
import * as jwt from "express-jwt";
import { GraphQLServer } from "graphql-yoga";
import { ContextParameters, Props } from "graphql-yoga/dist/types";
import * as mongoose from "mongoose";
import "reflect-metadata";
import { buildSchema } from "type-graphql";

import { authChecker } from "./auth-checker";
import { Constants } from "./constants";
import { Context } from "./context";
import { AuthenticationResolver } from "./schema/authentication/authentication-resolvers";
import { PostResolver, QuestionResolver } from "./schema/resolvers";
import { userDatabase } from "./user-database";

import { GRAPHQL_SERVER_OPTIONS, JWT_SECRET, MONGO_URL, MONGOOSE_OPTIONS } from "./configuration";

interface AppRequest extends Request {
    user?: any;
}

async function startServer() {
    const schema = await buildSchema({
        resolvers: [QuestionResolver, PostResolver, AuthenticationResolver],
        authChecker,
    });

    const serverProps: Props = {
        schema: schema,
        context: (params: ContextParameters) => {
            const request: AppRequest = params.request;
            const tokenUser = request.user;

            const context: Context = {
                response: params.response,
            };

            if (tokenUser) {
                context.user = userDatabase[tokenUser.username];
            }
            return context;
        },
    };
    // Create GraphQL server
    const server = new GraphQLServer(serverProps);

    server.express.use(cookieParser());
    // server.express.use(require("body-parser").urlencoded({extended: true}));

    const auth = jwt({
        secret: JWT_SECRET,
        credentialsRequired: false,
        getToken: (request: Request) => request.cookies[Constants.AUTHENTICATION_COOKIE_NAME],
    });
    server.express.use(auth);

    // Start the server
    server.start(GRAPHQL_SERVER_OPTIONS, ({ port, playground }) => {
        console.log(
            `Server is running, GraphQL Playground available at http://localhost:${port}${playground}`
        );
    });
}

async function connectMongo() {
    const options = MONGOOSE_OPTIONS;
    return mongoose.connect(`mongodb://${MONGO_URL}`, options);
}

async function main() {
    connectMongo();

    mongoose.set("debug", true);

    function serializer(data) {
        const query = JSON.stringify(data.query);
        const options = JSON.stringify(data.options || {});

        return `db.${data.coll}.${data.method}(${query}, ${options});`;
    }

    mongoose.set("debug", (coll, method, query, doc, options) => {
        const set = {
            coll: coll,
            method: method,
            query: query,
            doc: doc,
            options: options,
        };
        // tslint:disable-next-line:no-console
        console.info("Mongo:", serializer(set));
    });

    mongoose.connection
        .on("error", console.error.bind(console, "connection error:"))
        .once("open", () => {
            console.log("MongoDB connected.");

            return startServer();
        });
}

main();
