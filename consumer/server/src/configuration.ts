import { Options } from "graphql-yoga";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const GRAPHQL_SERVER_OPTIONS: Options = {
    port: 4000,
    endpoint: "/graphql",
    playground: "/graphql",
};

export const MONGO_URL = process.env.MONGO_URL || "localhost:27017/local";
export const MONGOOSE_OPTIONS = {
    useNewUrlParser: true,
    reconnectTries: 200,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
};
