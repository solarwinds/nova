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

import { Component, Inject, Input } from "@angular/core";

import { IMenuGroup, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-panel-collapse-top-oriented-example",
    templateUrl: "./panel-collapse-top-oriented.example.component.html",
    standalone: false
})
export class PanelCollapseTopOrientedExampleComponent {
    @Input() isOn = true;

    constructor(@Inject(ToastService) private toastService: ToastService) {}

    public itemsSource: IMenuGroup[] = [
        {
            header: $localize`section title`,
            itemsSource: [
                {
                    title: $localize`Menu Item`,
                    itemType: "action",
                    action: this.actionDone.bind(this),
                },
                {
                    title: $localize`Hover me`,
                    itemType: "action",
                    action: this.actionDone.bind(this),
                },
                { title: $localize`Selected menu item`, isSelected: true },
                {
                    title: $localize`Menu item`,
                    itemType: "switch",
                    checked: true,
                },
                {
                    title: $localize`Menu disabled item`,
                    itemType: "switch",
                    checked: false,
                    disabled: true,
                },
                {
                    title: $localize`Menu item with checkbox`,
                    itemType: "option",
                    disabled: true,
                },
                {
                    title: $localize`Menu item with icon`,
                    itemType: "action",
                    icon: "table",
                },
                {
                    title: $localize`Link menu item`,
                    itemType: "link",
                    url: "#button",
                    disabled: true,
                },
                {
                    title: $localize`Export PDF`,
                    itemType: "link",
                    icon: "export-pdf",
                    url: "#button",
                },
            ],
        },
    ];

    private actionDone(): void {
        this.toastService.info({
            message: $localize`Action Done!!`,
            title: $localize`Menu Action`,
        });
    }
}
