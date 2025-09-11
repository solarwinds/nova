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
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    Output,
} from "@angular/core";

import { KEYBOARD_CODE } from "../../../constants/keycode.constants";

/** @ignore */

@Component({
    selector: "nui-tab-heading",
    templateUrl: "./tab-heading.component.html",
    styleUrls: ["./tab-heading.component.less"],
    host: { role: "tab" },
})
export class TabHeadingComponent {
    /** This adds 'disabled' class to the host component depending on the 'disabled' @Input to properly style disabled tabs */
    @HostBinding("class.disabled")
    get isDisabled(): boolean {
        return this.disabled;
    }

    @HostBinding("attr.aria-selected")
    get ariaSelected(): string | null {
        return this.active ? "true" : null;
    }

    /** If true tab can not be activated  */
    @Input() disabled: boolean;

    /** Tab active state toggle */
    @Input()
    set active(isActive: boolean) {
        this._active = isActive;
        this.changeDetector.detectChanges();
    }
    get active(): boolean {
        return this._active;
    }

    /** Tab id */
    @Input() tabId: string;

    /** Event is fired when tab became active, $event:Tab equals to selected instance of Tab component */
    @Output() selected: EventEmitter<TabHeadingComponent> = new EventEmitter();

    protected _active: boolean;

    constructor(
        private changeDetector: ChangeDetectorRef,
        private elementRef: ElementRef
    ) {}

    public selectTab(): void {
        if (!this.disabled) {
            this.selected.emit(this);
        }
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (event.key === KEYBOARD_CODE.ENTER) {
            this.elementRef.nativeElement.click();
        }
    }
}

