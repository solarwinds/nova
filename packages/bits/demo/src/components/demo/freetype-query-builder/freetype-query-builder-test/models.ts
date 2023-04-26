import { QueryToken } from "@nova-ui/bits";

export interface ExampleAppToken extends QueryToken {
    issue?: any;
    issueMessage?: string;
    type: ExampleAppTokenType;
}

export enum ExampleAppTokenType {
    NUMBER = "NUMBER",
    STRING = "STRING",
    STRING_WITHOUT_NUMBER = "STRING_WITHOUT_NUMBER",
}
