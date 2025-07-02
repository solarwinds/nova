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

import { DOCUMENT } from "@angular/common";
import { Component, OnDestroy, Renderer2, RendererFactory2, ViewEncapsulation, inject } from "@angular/core";

@Component({
    selector: "custom-theme-example",
    templateUrl: "./custom-theme.example.component.html",
    styleUrls: ["./custom-theme.example.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class CustomThemeExampleComponent implements OnDestroy {
    private readonly renderer: Renderer2;
    private readonly containerElement: Element;
    private readonly customClassName = "clown-party-theme";

    // Inject the RendererFactory2 for manipulating the DOM and inject the document for manipulation
    constructor() {
        const rendererFactory = inject(RendererFactory2);
        const document = inject<Document>(DOCUMENT);

        // Get the root html element
        this.containerElement = document.children[0];
        // Create a renderer instance
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    public ngOnDestroy(): void {
        // cleanup
        this.renderer.removeClass(this.containerElement, this.customClassName);
    }

    public setTheme(value: boolean): void {
        // add/remove the custom class to the root html element based on the switch's value
        this.renderer[value ? "addClass" : "removeClass"](
            this.containerElement,
            this.customClassName
        );
    }
}
