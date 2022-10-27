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
    selector: "nui-menu-test",
    templateUrl: "./menu-test.component.html",
})
export class MenuTestComponent {
    public itemsSource: IMenuGroup[] = [
        {
            header: "section title",
            itemsSource: [
                {
                    title: "Menu Item",
                    itemType: "action",
                    action: this.actionDone,
                },
                { title: "Selected menu item", isSelected: true },
                {
                    title: "Switched checked",
                    itemType: "switch",
                    checked: true,
                },
                {
                    title: "Switch unchecked",
                    itemType: "switch",
                    checked: false,
                },
                {
                    title: "Disabled switch",
                    itemType: "switch",
                    disabled: true,
                    checked: false,
                },
                {
                    title: "Disabled action",
                    itemType: "action",
                    disabled: true,
                },
                {
                    title: "Disabled link",
                    itemType: "link",
                    url: "#button",
                    disabled: true,
                },
                {
                    title: "Disabled option",
                    itemType: "option",
                    disabled: true,
                    checked: false,
                },
                { title: "Menu item with checkbox", itemType: "option" },
                {
                    title: "Menu item with icon",
                    itemType: "action",
                    icon: "table",
                },
                { title: "Link menu item", itemType: "link", url: "#button" },
                {
                    title: "Export PDF",
                    itemType: "link",
                    icon: "export-pdf",
                    url: "#button",
                },
            ],
        },
        {
            header: "section 2 title",
            itemsSource: [
                {
                    title: "Menu Item1",
                    itemType: "option",
                    action: this.actionDone,
                },
                {
                    title: "Menu Item2",
                    itemType: "option",
                    action: this.actionDone,
                },
                {
                    title: "Menu Item3",
                    itemType: "option",
                    action: this.actionDone,
                },
            ],
        },
    ];

    public actionDone(): void {
        console.log("Action Done");
    }
}
