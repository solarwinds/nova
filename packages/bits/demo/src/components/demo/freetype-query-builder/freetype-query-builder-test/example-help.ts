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
