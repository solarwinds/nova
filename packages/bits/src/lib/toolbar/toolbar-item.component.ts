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
    AfterContentInit,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";

import { ToolbarItemDisplayStyle, ToolbarItemType } from "./public-api";
/**
 * @ignore
 */

@Component({
    selector: "nui-toolbar-item",
    template: "<ng-content></ng-content>",
    host: { class: "nui-toolbar-item" },
})
export class ToolbarItemComponent implements AfterContentInit {
    @Input() public type = ToolbarItemType.primary;
    @Input() public icon: string;
    @Input() public title: string;
    /**
     * Property for add destructive style to toolbar item.
     * Destructive item should be added always last by user.
     */

    @Input() public displayStyle = ToolbarItemDisplayStyle.action;
    public menuHidden: boolean;

    @Output() public actionDone = new EventEmitter();

    public get isDestructive() {
        return this.displayStyle === ToolbarItemDisplayStyle.destructive;
    }

    ngAfterContentInit() {
        this.menuHidden = this.type === ToolbarItemType.secondary;
    }
}
