import { Tokenizer } from "@nova-ui/bits";

import { ExampleAppToken, ExampleAppTokenType } from "./models";

export class ExampleTokenizer implements Tokenizer<ExampleAppToken> {
    tokenizeText(text: string): ExampleAppToken[] {
        if (!text) {
            return [];
        }
        const trimmedText = text.trim();
        const SEPARATOR = " ";
        const tokens: ExampleAppToken[] = [];
        const splits = trimmedText.split(SEPARATOR);
        let index = 0;
        for (let i = 0; i < splits.length; i++) {
            tokens.push({
                value: splits[i],
                type: this.getTokenType(splits[i]),
                start: index,
                end: index + splits[i].length - 1,
            });
            index += splits[i].length + SEPARATOR.length;
        }
        return tokens;
    }

    private getTokenType(tokenValue: string): ExampleAppTokenType {
        if (/SELECT/.test(tokenValue)) {
            return ExampleAppTokenType.SELECT_KEYWORD;
        } else if (/FROM/.test(tokenValue)) {
            return ExampleAppTokenType.FROM_KEYWORD;
        } else if (/\w+|\*/.test(tokenValue)) {
            return ExampleAppTokenType.STRING;
        }
        return ExampleAppTokenType.UNDEFINED;
    }
}
