// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
        if (this.containsSelectToken(tokens) || idx === 1) {
            currentHelp.push(
                { displayValue: "*", value: "*" },
                { displayValue: "name", value: "name" },
                { displayValue: "age", value: "age" },
                { displayValue: "address", value: "address" }
            );
            return currentHelp;
        }

        if (
            this.containsSelectionValue(tokens) ||
            tokens[idx]?.type === ExampleAppTokenType.FROM_KEYWORD
        ) {
            currentHelp.push({ displayValue: "FROM", value: "FROM" });
            return currentHelp;
        }

        if (this.containsFromToken(tokens) || idx === 3) {
            currentHelp.push(
                { displayValue: "Table1", value: "Table1" },
                { displayValue: "Table2", value: "Table2" },
                { displayValue: "Table3", value: "Table3" }
            );
            return currentHelp;
        }

        if (this.containsFromValue(tokens)) {
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
