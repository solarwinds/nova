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
        const currentHelp: HelpEntry[] = [];
        if (tokens[idx]?.issue) {
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
        if (
            tokens.length === 0 ||
            tokens[idx]?.type === ExampleAppTokenType.SELECT_KEYWORD
        ) {
            currentHelp.push({ displayValue: "SELECT", value: "SELECT" });
            return currentHelp;
        }
        if (this.containsFromValue(tokens)) {
            return currentHelp;
        }
        if (this.containsFromToken(tokens)) {
            currentHelp.push(
                { displayValue: "Table1", value: "Table1" },
                { displayValue: "Table2", value: "Table2" },
                { displayValue: "Table3", value: "Table3" }
            );
            return currentHelp;
        }
        if (this.containsSelectionValue(tokens)) {
            currentHelp.push({ displayValue: "FROM", value: "FROM" });
            return currentHelp;
        }
        if (this.containsSelectToken(tokens)) {
            currentHelp.push(
                { displayValue: "*", value: "*" },
                { displayValue: "name", value: "name" },
                { displayValue: "age", value: "age" },
                { displayValue: "address", value: "address" }
            );
            return currentHelp;
        }

        return currentHelp;
    }

    containsSelectToken(tokens: ExampleAppToken[]): boolean {
        const tokenTypes = tokens.map((token: ExampleAppToken) => token.type);

        return (
            tokenTypes.toString() ===
            [ExampleAppTokenType.SELECT_KEYWORD].toString()
        );
    }

    containsSelectionValue(tokens: ExampleAppToken[]): boolean {
        const tokenTypes = tokens.map((token: ExampleAppToken) => token.type);

        return (
            tokenTypes.toString() ===
            [
                ExampleAppTokenType.SELECT_KEYWORD,
                ExampleAppTokenType.STRING,
            ].toString()
        );
    }

    containsFromToken(tokens: ExampleAppToken[]): boolean {
        const tokenTypes = tokens.map((token: ExampleAppToken) => token.type);

        return (
            tokenTypes.toString() ===
            [
                ExampleAppTokenType.SELECT_KEYWORD,
                ExampleAppTokenType.STRING,
                ExampleAppTokenType.FROM_KEYWORD,
            ].toString()
        );
    }

    containsFromValue(tokens: ExampleAppToken[]): boolean {
        const tokenTypes = tokens.map((token: ExampleAppToken) => token.type);

        return (
            tokenTypes.toString() ===
            [
                ExampleAppTokenType.SELECT_KEYWORD,
                ExampleAppTokenType.STRING,
                ExampleAppTokenType.FROM_KEYWORD,
                ExampleAppTokenType.STRING,
            ].toString()
        );
    }
}
