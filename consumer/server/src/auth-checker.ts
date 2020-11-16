import { AuthChecker } from "type-graphql";

import { Context } from "./context";

export const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
    if (!roles || roles.length === 0) {
        return user !== undefined;
    }
    if (!user) {
        return false;
    }
    if (user.roles.some(role => roles.includes(role))) {
        return true;
    }
    return false;
};
