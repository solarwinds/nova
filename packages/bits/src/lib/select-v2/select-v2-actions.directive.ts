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

import { Directive, ElementRef, HostListener, Inject, Optional } from "@angular/core";

import { isArrowKey, isReturnToListKey, NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "./constants";
import { IFocusableAction, IOptionedComponent } from "./types";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";

/** Shared keyboard/focus behavior for nested controls (option and group actions). */
@Directive()
export abstract class SelectV2ActionBaseDirective implements IFocusableAction {
    /** The arrow key used to enter this action; pressing it again is a no-op. */
    protected abstract readonly entryKey: string;

    constructor(
        private elRef: ElementRef<HTMLElement>,
        @Optional()
        @Inject(NUI_SELECT_V2_OPTION_PARENT_COMPONENT)
        private parent: IOptionedComponent
    ) {}

    public focus(): void {
        this.elRef.nativeElement.focus();
    }

    /** Keeps the option key manager from reacting to keys pressed on the action. */
    @HostListener("keydown", ["$event"])
    public onKeydown(event: KeyboardEvent): void {
        event.stopPropagation();

        // Tab exits the widget: close the dropdown and refocus the trigger
        // first, then let native Tab navigation continue from there (the
        // action lives in a portaled overlay, so it isn't in the trigger's
        // own tab order).
        if (event.code === KEYBOARD_CODE.TAB) {
            this.parent?.hideDropdown?.();
            this.parent?.focusTrigger?.();
            return;
        }

        // Never let arrow keys scroll the page while the action holds focus.
        if (isArrowKey(event.code)) {
            event.preventDefault();
        }

        // Any other arrow or Escape returns focus to the list.
        if (isReturnToListKey(event.code, this.entryKey)) {
            event.preventDefault();
            this.parent?.focusTrigger?.();
        }
    }

    /** Prevents the parent from selecting/closing when the action is activated. */
    @HostListener("click", ["$event"])
    public onClick(event: MouseEvent): void {
        event.stopPropagation();
    }
}

/** Marks a nested control inside a `nui-select-v2-option` as reachable via ArrowRight. */
@Directive({
    selector: "[nuiSelectV2OptionAction]",
    host: {
        tabindex: "-1",
    },
    standalone: false,
})
export class SelectV2OptionActionDirective extends SelectV2ActionBaseDirective {
    protected readonly entryKey = KEYBOARD_CODE.ARROW_RIGHT;
}

/** Marks a group header control as reachable via ArrowUp on the first option. */
@Directive({
    selector: "[nuiSelectV2GroupAction]",
    host: {
        tabindex: "-1",
    },
    standalone: false,
})
export class SelectV2GroupActionDirective extends SelectV2ActionBaseDirective {
    protected readonly entryKey = KEYBOARD_CODE.ARROW_UP;
}
