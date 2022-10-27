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

import { IMenuGroup } from "@nova-ui/bits";

@Component({
    selector: "nui-toolbar-test",
    templateUrl: "./toolbar-test.component.html",
})
export class ToolbarTestExampleComponent {
    public width = "800px";

    public showFirst = true;

    public itemsSource: IMenuGroup[] = [
        {
            header: "section title",
            itemsSource: [
                { title: "Menu Item", itemType: "action" },
                { title: "Hover me", itemType: "action" },
                { title: "Selected menu item", isSelected: true },
                { title: "Menu item", itemType: "switch", checked: true },
                {
                    title: "Menu disabled item",
                    itemType: "switch",
                    checked: false,
                    disabled: true,
                },
                {
                    title: "Menu item with checkbox",
                    itemType: "option",
                    disabled: true,
                },
                {
                    title: "Menu item with icon",
                    itemType: "action",
                    icon: "table",
                },
                {
                    title: "Link menu item",
                    itemType: "link",
                    url: "#button",
                    disabled: true,
                },
                {
                    title: "Export PDF",
                    itemType: "link",
                    icon: "export-pdf",
                    url: "#button",
                },
            ],
        },
    ];

    public select = {
        current: 1,
        total: 72,
    };

    public onOptionChange(value: string) {
        this.width = value;
    }

    public onToggle() {
        this.showFirst = !this.showFirst;
    }
}
