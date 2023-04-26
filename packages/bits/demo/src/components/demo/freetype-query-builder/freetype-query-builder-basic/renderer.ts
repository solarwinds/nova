import { HighlightColor, NotifColor, RenderConfigurator } from "@nova-ui/bits";

import { ExampleAppToken, ExampleAppTokenType } from "./models";

export class ExampleAppRenderer implements RenderConfigurator<ExampleAppToken> {
    getHighlightColor(token: ExampleAppToken): HighlightColor {
        switch (token.type) {
            case ExampleAppTokenType.SELECT_KEYWORD:
                return HighlightColor.COL_1;
            case ExampleAppTokenType.FROM_KEYWORD:
                return HighlightColor.COL_2;
            case ExampleAppTokenType.STRING:
                return HighlightColor.COL_3;
            case ExampleAppTokenType.UNDEFINED:
                return HighlightColor.COL_3;
            default:
                return HighlightColor.COL_3;
        }
    }

    getNotifColor(token: ExampleAppToken): string {
        return NotifColor[token.issue as keyof typeof NotifColor];
    }

    enhanceTokens(tokens: ExampleAppToken[]): ExampleAppToken[] {
        return tokens;
    }
}
