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

import { Component } from "@angular/core";

@Component({
    selector: "nui-freetype-query-builder-docs-example",
    templateUrl: "freetype-query-builder-docs.example.component.html",
    styleUrls: ["freetype-query-builder-docs.example.component.less"],
    standalone: false,
})
export class FreetypeQueryBuilderDocsExampleComponent {
    tokenizerExample =
        "export class ExampleTokenizer implements Tokenizer<ExampleToken> {\n" +
        "  tokenizeText(query: string): ExampleToken[];\n" +
        "    // Implement your logic to tokenize the query string\n" +
        "    // Here's a simple example that splits the query by spaces\n" +
        "    const tokens = query.split(' ').map((value) => new ExampleToken(value.trim()));\n" +
        "\n" +
        "    return tokens;\n" +
        "}";

    rendererExample =
        "class ExampleRenderConfigurator implements RenderConfigurator<ExampleToken> {\n" +
        "  getNotifColor(token: ExampleToken): string {\n" +
        "    // Implement your logic to determine the border color of the token\n" +
        "    // Return the color as a string\n" +
        "    return token.type === ExampleTokenType.TYPE1 ? 'red' : 'black';\n" +
        "  }\n" +
        "\n" +
        "  getHighlightColor(token: ExampleToken): string {\n" +
        "    // Implement your logic to determine the color of the token\n" +
        "    // Return the color as a string\n" +
        "    return token.type === ExampleTokenType.TYPE1 ? 'yellow' : 'white';\n" +
        "  }\n" +
        "\n" +
        "  enhanceTokens(tokens: ExampleToken[]): ExampleToken[] {\n" +
        "    // Implement your logic to enhance the tokens, if needed\n" +
        "    // Return the updated array of tokens\n" +
        "    return tokens;\n" +
        "  }\n" +
        "}";
}
