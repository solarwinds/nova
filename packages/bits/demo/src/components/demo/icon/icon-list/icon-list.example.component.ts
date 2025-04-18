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

import { IconService } from "./../../../../../../src/lib/icon/icon.service";
import { NgFor, NgIf } from "@angular/common";
import { NuiExpanderModule } from "../../../../../../src/lib/expander/expander.module";
import { NuiIconModule } from "../../../../../../src/lib/icon/icon.module";

@Component({
    selector: "nui-icon-list-example",
    templateUrl: "./icon-list.example.component.html",
    imports: [NgFor, NuiExpanderModule, NgIf, NuiIconModule]
})
export class IconListExampleComponent implements OnInit {
    public icons: any[];
    public categories: any[];

    constructor(private iconService: IconService) {}

    public ngOnInit(): void {
        this.icons = this.iconService.icons;
        this.categories = this.getCategories(this.icons);
    }

    private getCategories(icons: any[]) {
        const categories = [];
        for (const icon of icons) {
            if (categories.indexOf(icon.category) === -1) {
                categories.push(icon.category);
            }
        }
        return categories;
    }
}
