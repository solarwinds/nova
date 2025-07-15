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

import { Highlightable } from "@angular/cdk/a11y";
import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    Optional,
    Output,
    SimpleChanges,
} from "@angular/core";

import { MenuGroupComponent } from "../menu-group/menu-group.component";

/**
 * @ignore
 */

/**
 * Base class for menu items. Adds styles to host element
 */
@Directive()
export abstract class MenuItemBaseComponent
    implements OnChanges, Highlightable
{
    /**
     * Disables action, link and option components
     */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() public disabled?: boolean;

    @HostBinding("class.nui-menu-item") public setDefaultClass = true;

    @HostBinding("class.nui-menu-item--disabled")
    public setDisabledClass: boolean;

    @HostBinding("class.nui-menu-item--active") get active(): boolean {
        return this.isActive;
    }

    @Output() public actionDone = new EventEmitter<boolean | undefined>();

    public isActive: boolean;

    abstract menuItem: ElementRef;

    constructor(
        @Optional() readonly group: MenuGroupComponent,
        private cd: ChangeDetectorRef
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        const disabled =
            (changes["disabled"] && changes["disabled"].currentValue) || false;

        this.setDisabledClass = disabled;
    }

    public setActive(val: boolean): void {
        this.isActive = val;
    }

    public setActiveStyles(): void {
        this.cd.markForCheck();
        this.isActive = true;
    }

    public setInactiveStyles(): void {
        this.cd.markForCheck();
        this.isActive = false;
    }

    abstract doAction(event?: any): void;
}
