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

import { Component } from "@angular/core";

@Component({
    selector: "nui-select-custom-template-example",
    templateUrl: "./select-custom-template.example.component.html",
    styleUrls: ["./select-custom-template.example.component.less"],
    standalone: false
})
export class SelectCustomTemplateExampleComponent {
    public dataset = {
        displayValue: "value",
        selectedItem: "",
        items: [
            {
                name: "item_1",
                value: "Bonobo",
                icon: "severity_ok",
                progress: 78,
            },
            {
                name: "item_2",
                value: "Zelda",
                icon: "severity_ok",
                progress: 66,
            },
            {
                name: "item_3",
                value: "Max",
                icon: "severity_critical",
                progress: 7,
            },
            {
                name: "item_4",
                value: "Apple",
                icon: "severity_ok",
                progress: 24,
            },
            {
                name: "item_5",
                value: "Quartz",
                icon: "severity_warning",
                progress: 89,
            },
        ],
    };

    constructor() {}
}
