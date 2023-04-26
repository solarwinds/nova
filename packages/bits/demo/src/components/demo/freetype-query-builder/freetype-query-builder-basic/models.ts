import { QueryToken } from "@nova-ui/bits";

export interface ExampleAppToken extends QueryToken {
    issue?: any;
    issueMessage?: string;
    type: ExampleAppTokenType;
}

export enum ExampleAppTokenType {
    SELECT_KEYWORD = "SELECT_KEYWORD",
    FROM_KEYWORD = "FROM_KEYWORD",
    STRING = "STRING",
    OPERATOR = "OPERATOR",
    LOG_OPERATOR = "LOG_OPERATOR",
    UNDEFINED = "UNDEFINED",
}

export enum LogicalOperator {
    AND = "AND",
    OR = "OR",
}

export enum Operator {
    EQUAL = "=",
    NOT_EQUAL = "!=",
    BIGGER = ">",
    SMALLER = "<",
}
