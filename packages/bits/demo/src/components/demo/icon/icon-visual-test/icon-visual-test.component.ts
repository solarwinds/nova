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

import { Component, OnInit } from "@angular/core";

import { IconStatus, IconCategory } from "@nova-ui/bits";

import {
    icons as iconsData,
    ITypedIconData,
} from "../../../../../../src/lib/icon/icons";

@Component({
    selector: "nui-icon-visual-test",
    templateUrl: "./icon-visual-test.component.html",
    standalone: false
})
export class IconVisualTestComponent implements OnInit {
    public icons: ITypedIconData[];
    public categories: IconCategory[];
    public iconStatuses: string[] = Object.values(IconStatus);

    public ngOnInit(): void {
        this.icons = iconsData;
        this.categories = this.getCategories(iconsData);
    }

    public getCategories(icons: ITypedIconData[]): IconCategory[] {
        return Array.from(new Set(icons.flatMap((icon) => icon.category)));
    }
}
