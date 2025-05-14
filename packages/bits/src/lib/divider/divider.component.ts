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
    HostBinding,
    Input,
    ViewEncapsulation,
} from "@angular/core";

import { DividerSize } from "./public-api";

// <example-url>./../examples/index.html#/divider</example-url>

/** @ignore */
@Component({
    selector: "nui-divider",
    template: "",
    host: {
        class: "nui-divider",
        role: "separator",
    },
    styleUrls: ["./divider.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    standalone: false,
})
export class DividerComponent {
    /**
     * Defines if divider is vertical.
     */
    @Input() isVertical: boolean;

    /**
     * Defines divider's margins.
     */
    @Input() size: DividerSize;

    @HostBinding("class.nui-divider--vertical")
    public get isVerticalDivider(): boolean {
        return this.isVertical;
    }

    @HostBinding("class.nui-divider--horizontal")
    public get isHorizontalDivider(): boolean {
        return !this.isVertical;
    }

    @HostBinding("class.nui-divider--no-margin")
    public get isNoMargins(): boolean {
        return this.size === "no-margin";
    }

    @HostBinding("class.xs") public get isExtraSmall(): boolean {
        return this.size === "extra-small";
    }

    @HostBinding("class.sm") public get isSmall(): boolean {
        return this.size === "small";
    }

    @HostBinding("class.md") public get isMedium(): boolean {
        return this.size === "medium";
    }
}
