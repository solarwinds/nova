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

import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from "@angular/core";

import { BreadcrumbItem } from "./public-api";

// <example-url>./../examples/index.html#/breadcrumb</example-url>

@Component({
    selector: "nui-breadcrumb",
    styleUrls: ["./breadcrumb.component.less"],
    templateUrl: "./breadcrumb.component.html",
    encapsulation: ViewEncapsulation.None,
    host: { "[attr.aria-label]": "ariaLabel" },
})
export class BreadcrumbComponent {
    @Input() items: BreadcrumbItem[];
    @Input() ariaLabel: string = "Breadcrumb";
    @Output() navigation = new EventEmitter<string>();

    public handleClick(event: Event, item: BreadcrumbItem) {
        event.preventDefault();

        // We want to only handle the CRTL + Click event separately because Middle Mouse click
        // requires a different way of handling it, and so it doesn't conflict with the regular click event.
        if ((event as any).ctrlKey) {
            if (item?.url) {
                // This opens the url link in a new browser tab
                window.open(item?.url, "_blank");
            }
            return;
        }
        // We only navigate the angular router on regular clicks
        this.navigation.emit(item.routerState);
    }
}
