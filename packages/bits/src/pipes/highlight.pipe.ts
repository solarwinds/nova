// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
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

import { Pipe, PipeTransform } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";
import escape from "lodash/escape";
import escapeRegExp from "lodash/escapeRegExp";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";

/**
 * <example-url>./../examples/index.html#/pipes/highlight</example-url>
 *
 * The nuiHighlight pipe is used to mark a portion of text. It will search the provided text for the specified string and highlight it. Returns HTML.
 * Can only be used with `innerHTML` directive. Escapes all the characters by default and highlights every match in the string.
 *
 * __Parameters :__
 *
 *   text - The source text.
 *
 *   search - The search term to be highlighted.
 *
 * __Usage :__
 *   "text" | nuiHighlight : "search"
 *
 * __Examples :__
 *
 *   <code>{{ "hello world" | nuiHighlight:"world" }}</code>
 *
 *   formats to: <code>hello &lt;span class="nui-highlighted"&gt;world&lt;/span&gt;</code>
 *
 *
 *   <code>{{ "hello &lt;span class="x"&gt;FOO&lt;/span&gt; bar" | nuiHighlight:"bar" }}</code>
 *
 *   formats to: <code>hello &lt;span class=&quot;x&quot;&gt;FOO&lt;/span&gt;&lt;span class="nui-highlighted"&gt;bar&lt;/span&gt;;</code>
 */
@Pipe({
    name: "nuiHighlight",
    standalone: false,
})
export class HighlightPipe implements PipeTransform {
    private readonly deduplicateStarsRegex = new RegExp("(\\\\\\*)+", "gi");

    public transform(text: string, search: string): SafeHtml {
        if (!isString(search) || isEmpty(search)) {
            return this.escapeItem(text);
        }
        const regex = new RegExp(
            "(" + this.getHighlightRegex(search) + ")",
            "i"
        );
        const matchRes = Array.from(text.split(regex));
        let result = "";
        for (let i = 0; i < matchRes.length; i++) {
            const isMatch = i % 2 !== 0;
            if (isMatch) {
                result += `<span class="nui-highlighted">${this.escapeItem(
                    matchRes[i]
                )}</span>`;
            } else {
                result += this.escapeItem(matchRes[i]);
            }
        }
        return result;
    }

    public escapeItem(item: string): string {
        return escape(item);
    }

    private getHighlightRegex = (text: string) => {
        const escaped = escapeRegExp(text);
        return escaped.replace(this.deduplicateStarsRegex, () => ".*");
    };
}
