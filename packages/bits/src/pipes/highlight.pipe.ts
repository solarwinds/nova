import { Pipe, PipeTransform } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";
import escape from "lodash/escape";
import escapeRegExp from "lodash/escapeRegExp";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
/**
 * <example-url>./../examples/index.html#/pipes/highlight</example-url>
 */

/**
 * Filter used for highlighting of part of plain text in case of search. Returns HTML.
 * Can only be used with `innerHTML` directive. Escapes all the characters by default and highlights every match in the string
 *
 * __Parameters :__
 *
 *   text - The source text.
 *
 *   search - The search term to be highlighted.
 *
 * __Usage :__
 *   highlight | nuiHighlight:search
 *
 * __Examples :__
 *   <code>{{ "hello world" | nuiHighlight:"world" }}</code>
 *   formats to: <code>hello < span class="nui-highlighted"> world </ span></code>
 *
 *
 *   <code>{{ "hello < span class="x">FOO</ span> bar" | nuiHighlight:"bar" }}</code>
 *   formats to: <code>hello &lt; span class=&quot;x&quot;&gt;FOO&lt;/ span&gt; < span class="nui-highlighted">bar</ span> </ span></code>
 */
@Pipe({
    name: "nuiHighlight",
})
export class HighlightPipe implements PipeTransform {
    private readonly deduplicateStarsRegex = new RegExp("(\\\\\\*)+", "gi");

    public transform(text: string, search: string): SafeHtml {
        if (!isString(search) || isEmpty(search)) {
            return this.escapeItem(text);
        }
        const regex = new RegExp(  "(" + this.getHighlightRegex(search) + ")", "i");
        const matchRes = Array.from(text.split(regex));
        let result = "";
        for (let i = 0; i < matchRes.length; i++) {
            const isMatch = i % 2 !== 0;
            if (isMatch) {
                result += "<span class=\"nui-highlighted\">" + this.escapeItem(matchRes[i]) + "</span>";
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
    }
}
