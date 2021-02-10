/** @ignore */
declare var require: any;
import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
const hljs = require("highlight.js/lib/core");

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
 * where "highlight.js" should be used as alias to regular "highlight.js/lib/highlight.js"
 * to avoid loading all languages. And then just load what you really need, e.g. typescript
 *
 * hljs.registerLanguage("typescript", require("highlight.js/lib/languages/typescript"));
 *
 * __Name:__
 *
 * NUI Code component.
 *
 * __Usage:__
 *
 * ```html
 * <nui-example-code>{{code}}<nui-example-code>
 * ```
 *
 */
@Component({
    selector: "nui-example-code",
    templateUrl: "./example-code.component.html",
    styleUrls: ["./example-code.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class ExampleCodeComponent implements  AfterViewInit {
    /**
     * Programming language used (auto-detect if not present) - see
     * https://highlightjs.org/static/demo/ for possible values
     */
    @Input() public language: string;

    @ViewChild("code") public codeElement: ElementRef;

    public ngAfterViewInit() {
        // remove wrapping spaces. They might appear due to passing content via ng-content into element
        this.codeElement.nativeElement.innerHTML = this.codeElement.nativeElement.innerHTML.trim();
        hljs.highlightBlock(this.codeElement.nativeElement);
    }
}
