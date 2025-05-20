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

import { Component, Inject } from "@angular/core";

import { IMenuGroup, LoggerService } from "@nova-ui/bits";

@Component({
    selector: "nui-toolbar-embedded-content-example",
    templateUrl: "./toolbar-embedded-content.example.component.html",
})
export class ToolbarEmbeddedContentExampleComponent {
    public itemsSource: IMenuGroup[] = [
        {
            header: $localize`section title`,
            itemsSource: [
                { title: $localize`Menu Item`, itemType: "action" },
                { title: $localize`Hover me`, itemType: "action" },
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
    public busy = false;
    public placeholder = $localize`Placeholder`;
    public searchKey: string;
    public stringToSearch = $localize`
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec efficitur rutrum lacus id vulputate.
        Integer eu ex eu augue efficitur luctus quis ac elit. Nam odio est, iaculis nec varius id, congue erat.
        Nullam mi lectus, gravida quis pretium sit amet, accumsan non elit. In tempus commodo sem ac vulputate.
        Sed vel sagittis purus. Integer non ornare felis. Sed aliquam, purus et euismod tincidunt, felis ligula`;

    public value: string;
    private timerHandler: number;

    public constructor(@Inject(LoggerService) private logger: LoggerService) {}

    public onCancel(value: string): void {
        this.logger.warn("Example onCancel fired. Value passed: " + value);
        if (value === "") {
            this.value = "";
            this.searchKey = "";
        } else {
            this.doCancel();
        }
    }

    public onSearch(value: string): void {
        this.logger.warn(
            "Example onSearch fired. Current input value passed: " + value
        );
        this.doSearch(value);
    }

    private doCancel(): void {
        clearTimeout(this.timerHandler);
        this.busy = false;
    }

    private doSearch(value: string): void {
        this.logger.warn("Example search started.");
        const _this = this;
        clearTimeout(_this.timerHandler);
        _this.busy = true;
        _this.timerHandler = <any>setTimeout(() => {
            _this.busy = false;
            _this.searchKey = value;
            _this.logger.warn("Example search finished.");
        }, 2000);
    }
}
