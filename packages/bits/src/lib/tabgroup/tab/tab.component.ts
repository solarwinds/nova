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

import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, TemplateRef, ViewEncapsulation, inject } from "@angular/core";

import { TabGroupComponent } from "../tab-group/tab-group.component";
/** @ignore */
@Component({
    selector: "nui-tab",
    template: `
        <div [hidden]="!active"><ng-content></ng-content></div>
        <ng-template *ngIf="active" [ngTemplateOutlet]="templateRef">
        </ng-template>
    `,
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class TabComponent {
    private tabGroup = inject(TabGroupComponent);

    /** Tab header text */
    @Input() heading: string;
    /** If true tab can not be activated  */
    @Input() disabled: boolean;

    @Input() templateRef: TemplateRef<ElementRef>;

    /** Tab active state toggle */
    @Input()
    get active(): boolean {
        return this._active;
    }

    set active(active: boolean) {
        if (this._active === active) {
            return;
        }

        if ((this.disabled && active) || !active) {
            if (this._active && !active) {
                this.deselected.emit(this);
                this._active = active;
            }

            return;
        }

        this._active = active;
        this.selected.emit(this);
    }

    /** Event is fired when tab became active, $event:Tab equals to selected instance of Tab component */
    @Output() selected: EventEmitter<TabComponent> = new EventEmitter();
    /** Event is fired when tab became inactive, $event:Tab equals to deselected instance of Tab component */
    @Output() deselected: EventEmitter<TabComponent> = new EventEmitter();

    @HostBinding("class.tab-pane") addClass = true;

    public headingRef: TemplateRef<any>;
    protected _active: boolean;

    constructor() {
        this.tabGroup.addTab(this);
    }
}
