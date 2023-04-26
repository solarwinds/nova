import { HelpEntry } from "@nova-ui/bits";

import { ExampleAppToken, ExampleAppTokenType } from "./models";

/**
 * This is example of how can be help updated based on selected token also shows how notifications can be shown.
 *
 * This is NOT required approach.
 *
 * FreeTypeQueryBuilder does not enforce specific approach.
 *
 * This specific example is updating help based on focused token type.
 */
export class ExampleHelp {
    getCurrentHelp(idx: number, tokens: ExampleAppToken[]): HelpEntry[] {
        const currentHelp = [];
        if (idx >= 0 && tokens[idx].issue) {
            currentHelp.push({
                items: [
                    {
                        message: {
                            displayValue: tokens[idx].issueMessage,
                        },
                        severity: tokens[idx].issue,
                    },
                ],
                notice: true,
            });
        }
        if (idx >= 0) {
            switch (tokens[idx].type) {
                case ExampleAppTokenType.NUMBER:
                    currentHelp.push(
                        { displayValue: "111", value: "111" },
                        { displayValue: "123", value: "123" },
                        { displayValue: "222", value: "222" }
                    );
                    break;
                case ExampleAppTokenType.STRING:
                    currentHelp.push(
                        { displayValue: "aaa1", value: "aaa1" },
                        { displayValue: "ab1c", value: "ab1c" },
                        { displayValue: "1bbb", value: "1bbb" }
                    );
                    break;
                case ExampleAppTokenType.STRING_WITHOUT_NUMBER:
                    currentHelp.push(
                        { displayValue: "aaa", value: "aaa" },
                        { displayValue: "abc", value: "abc" },
                        { displayValue: "bbb", value: "bbb" }
                    );
                    break;
                default:
            }
        }

        return currentHelp;
    }
}
