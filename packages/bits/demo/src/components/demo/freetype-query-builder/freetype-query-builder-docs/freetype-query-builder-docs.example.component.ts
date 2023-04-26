import { Component } from "@angular/core";

@Component({
    selector: "nui-freetype-query-builder-docs-example",
    templateUrl: "freetype-query-builder-docs.example.component.html",
    styleUrls: ["freetype-query-builder-docs.example.component.less"],
})
export class FreetypeQueryBuilderDocsExampleComponent {
    tokenizerExample =
        "import { Tokenizer } from \"@nova-ui/bits\";\n" +
        "\n" +
        "export class ExampleTokenizer implements Tokenizer<ExampleAppToken>{\n" +
        "    tokenizeText(text: string): ExampleAppToken[] {\n" +
        "        //....\n" +
        "        return tokens;\n" +
        "    }\n" +
        "}\n";

    // rendererExample = "import {\n" +
    //     "    ExampleAppToken,\n" +
    //     "    ExampleAppTokenType,\n" +
    //     "} from \"./models\";\n" +
    //     "import { HighlightColor, NotifColor, RenderConfigurator } from \"@nova-ui/bits\";\n" +
    //     "\n" +
    //     "export class ExampleAppRenderer implements RenderConfigurator<ExampleAppToken> {\n" +
    //     "    getHighlightColor(token: ExampleAppToken): HighlightColor {\n" +
    //     "        //...\n" +
    //     "        return highlightColor;\n" +
    //     "    }\n" +
    //     "\n" +
    //     "    getNotifColor(token: ExampleAppToken): string {\n" +
    //     "        //...\n" +
    //     "        return notifColor;\n" +
    //     "    }\n" +
    //     "\n" +
    //     "    enhanceTokens(tokens: ExampleAppToken[]): ExampleAppToken[] {\n" +
    //     "        //...\n" +
    //     "        return enhanceTokens;\n" +
    //     "    }\n" +
    //     "}\n";

    rendererExample =
        "import {\n" +
        "    ExampleAppToken,\n" +
        "    ExampleAppTokenType,\n" +
        "} from \"./models\";\n" +
        "import { HighlightColor, NotifColor, RenderConfigurator } from \"@nova-ui/bits\";\n" +
        "\n" +
        "export class ExampleAppRenderer implements RenderConfigurator<ExampleAppToken> {\n" +
        "    getHighlightColor(token: ExampleAppToken): HighlightColor {}\n" +
        "\n" +
        "    getNotifColor(token: ExampleAppToken): string {}\n" +
        "\n" +
        "    enhanceTokens(tokens: ExampleAppToken[]): ExampleAppToken[] {}\n" +
        "}\n";

    helpExample: string =
        "\n" +
        "import { ExampleAppToken, ExampleAppTokenType } from \"./models\";\n" +
        "import { HelpEntry } from \"@nova-ui/bits\";\n" +
        "\n" +
        "export class ExampleHelp {\n" +
        "    getCurrentHelp (idx: number, tokens: ExampleAppToken[]): HelpEntry[] {\n" +
        "        //...\n" +
        "        return currentHelp;\n" +
        "    }\n" +
        "}\n";
}
