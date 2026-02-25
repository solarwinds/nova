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

import { Injectable } from "@angular/core";

import { KEYBOARD_CODE } from "../../constants/keycode.constants";
import { MenuComponent } from "../menu";

@Injectable()
export class ToolbarKeyboardService {
    private toolbarItems: HTMLElement[] = [];
    private menu: MenuComponent | undefined;

    public setToolbarItems(items: HTMLElement[], menu?: MenuComponent): void {
        this.toolbarItems = items;
        this.menu = menu;
    }

    public onKeyDown(event: KeyboardEvent): void {
        // Allow native keyboard handling inside search inputs (e.g. arrow keys move caret)
        // instead of hijacking navigation for the whole toolbar.
        const target = event.target as HTMLElement | null;
        if (this.isSearchTarget(target)) {
            return;
        }

        const { code } = event;

        if (
            code === KEYBOARD_CODE.ARROW_LEFT ||
            code === KEYBOARD_CODE.ARROW_RIGHT
        ) {
            event.preventDefault();
            this.navigateByArrow(code);
        }

        if (code === KEYBOARD_CODE.TAB) {
            this.closeMenuIfOpened();
        }
    }

    private isSearchTarget(target: HTMLElement | null): boolean {
        if (!target) {
            return false;
        }

        // Common ways a search input can be marked in DOM.
        // - <input type="search">
        // - role="searchbox"
        // - a class/data attribute containing "search"
        const el = target.closest?.(
            "input[type=\"search\"], [role=\"searchbox\"], .search, [class*=\"search\"], [data-testid*=\"search\"], [data-automation-id*=\"search\"]"
        ) as HTMLElement | null;

        return !!el;
    }

    private navigateByArrow(code: KEYBOARD_CODE): void {
        const activeEl = document.activeElement;
        const activeIndex = this.toolbarItems.indexOf(activeEl as HTMLElement);
        const first = this.toolbarItems[0];
        const last = this.toolbarItems[this.toolbarItems.length - 1];

        if (code === KEYBOARD_CODE.ARROW_LEFT) {
            activeEl === first ? this.focusLast() : this.focusLeft(activeIndex);
        }

        if (code === KEYBOARD_CODE.ARROW_RIGHT && activeIndex !== -1) {
            activeEl === last
                ? this.focusFirst()
                : this.focusRight(activeIndex);
        }
    }

    private focusFirst(): void {
        this.toolbarItems[0].focus();
        this.closeMenuIfOpened();
    }

    private focusLast(): void {
        this.toolbarItems[this.toolbarItems.length - 1].focus();
    }

    private focusRight(index: number) {
        this.toolbarItems[index + 1]?.focus();
    }

    private focusLeft(index: number) {
        this.toolbarItems[index - 1]?.focus();
        this.closeMenuIfOpened();
    }

    private closeMenuIfOpened() {
        if (this.menu && this.menu?.popup?.isOpen) {
            this.menu.popup.isOpen = false;
        }
    }
}
