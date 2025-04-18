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

/** @ignore */
import {
    Component,
    Input,
    ViewEncapsulation,
} from "@angular/core";
import hljs from "highlight.js";

/**
 * <example-url>./../examples/index.html#/code</example-url><br />
 */

/**
 * @ignore
 * Purpose of this component is to format and colorize your source code snippets.
 * Optionally you can
 * specify a programming language to be used for highlighting, otherwise an automated detection will be used. This
 * directive is encapsulating Highlight.js library.
 *
 * Consumer needs to set up languages which need to be supported. It must happen before CodeComponent is rendered.
 * The best place is parent page/component's onInit() or in app initializer
 * example:
 *
 * import hljs from "highlight.js";
 *
 * where "highlight.js" should be used as alias to regular "highlight.js/lib/core.js"
 * to avoid loading all languages. And then just load what you really need, e.g. typescript
 *
 *
 * __Name:__
 *
 * NUI Code component.
 *
 * __Usage:__
 *
 * ```html
 * <nui-example-code [code]=[code]><nui-example-code>
 * ```
 *
 */
@Component({
    selector: "nui-example-code",
    templateUrl: "./example-code.component.html",
    styleUrls: ["./example-code.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class ExampleCodeComponent {
    /**
     * Programming language used (auto-detect if not present) - see
     * https://highlightjs.org/static/demo/ for possible values
     */
    @Input() public language: string = "typescript";

    public codeText = "";
    @Input() set code(c: string) {
        const code = c.trim();
        if (!code) {
            return;
        }
        this.codeText = hljs.highlight(code, { language: this.language }).value;
    }
}
