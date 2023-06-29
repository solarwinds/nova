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

import { ExampleAppToken, ExampleAppTokenType } from "./models";

export class ExampleTokenizer {
    tokenizeText(text: string, baseIdx?: number): ExampleAppToken[] {
        if (!text) {
            return [];
        }
        const SEPARATOR = " ";
        const simpleGetFirstTokenFromIndex = (
            value: string,
            index: number
        ): ExampleAppToken => {
            const nextSeparatorIdx = value.substr(index).indexOf(SEPARATOR);
            let token: ExampleAppToken;
            if (nextSeparatorIdx >= 0) {
                token = {
                    value: value.substr(index, nextSeparatorIdx),
                    type: ExampleAppTokenType.NUMBER,
                    start: index,
                    end: index + nextSeparatorIdx - 1,
                };
            } else {
                token = {
                    value: value.substr(index),
                    type: ExampleAppTokenType.NUMBER,
                    start: index,
                    end: value.length - 1,
                };
            }
            if (/^\d+$/.test(token.value)) {
                token.type = ExampleAppTokenType.NUMBER;
            } else if (/[\d]+/.test(token.value)) {
                token.type = ExampleAppTokenType.STRING;
            } else {
                token.type = ExampleAppTokenType.STRING_WITHOUT_NUMBER;
            }

            const length = token.value.length;
            const type =
                length > 5
                    ? "error"
                    : length > 4
                    ? "warning"
                    : length > 3
                    ? "info"
                    : undefined;
            if (type) {
                token.issue = type;
                token.issueMessage = "error message";
            }

            return token;
        };

        let lastEndIdx = 0;
        let nextEndIdx = 0;
        const tokens = [];
        if (baseIdx) {
            nextEndIdx = baseIdx;
        }

        do {
            const token = simpleGetFirstTokenFromIndex(text, nextEndIdx);
            tokens.push(token);
            lastEndIdx = token.end;
            nextEndIdx = token.end + 2;
        } while (lastEndIdx < text.length - 1 && nextEndIdx < text.length);

        return tokens;
    }
}
