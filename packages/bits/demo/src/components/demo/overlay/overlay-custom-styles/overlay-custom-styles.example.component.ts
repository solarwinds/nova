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

import { OverlayConfig } from "@angular/cdk/overlay";
import { Component, ViewEncapsulation } from "@angular/core";

import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "@nova-ui/bits";

@Component({
    selector: "nui-overlay-custom-styles-example",
    templateUrl: "./overlay-custom-styles.example.component.html",
    styleUrls: ["./overlay-custom-styles.example.component.less"],
    // This is done to make class from the less file global.
    // Make sure the class from the less file is added to your global style sheet.
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class OverlayCustomStylesExampleComponent {
    public itemsSource: string[] = [
        $localize`Item 1`,
        $localize`Item 2`,
        $localize`Item 3`,
        $localize`Item 4`,
    ];

    public config: OverlayConfig = {
        panelClass: [
            OVERLAY_WITH_POPUP_STYLES_CLASS,
            "nui-overlay-styling-demo-custom-class",
        ],
    };
}
