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
