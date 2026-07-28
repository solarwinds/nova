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
import moment, { Moment } from "moment/moment";

import { DayPickerComponent } from "./date-picker-day-picker.component";
import { DatePickerInnerComponent } from "./date-picker-inner.component";
import { MonthPickerComponent } from "./date-picker-month-picker.component";
import { YearPickerComponent } from "./date-picker-year-picker.component";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";

// Safety limit to avoid infinite loops when every remaining date happens to be disabled
const MAX_DISABLED_DATE_SKIPS = 366;

// Calendar units the grid can navigate by, one per picker mode
type CalendarUnit = "days" | "months" | "years";

// Any picker grid the keyboard service can move DOM focus within
interface FocusablePicker {
    focusActiveCell(): void;
}

/**
 * Handles keyboard interaction for the `nui-date-picker` day, month and year grids,
 * in line with the WAI-ARIA APG Date Picker Dialog pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
 * @ignore
 */
@Injectable()
export class DatePickerKeyboardService {
    // Per-mode grid navigation config: the calendar unit each arrow step moves by,
    // the number of grid columns (used for vertical Up/Down movement), and the unit
    // PageUp/PageDown jumps by. `pageAmount` is resolved at runtime for the year view,
    // which spans a full `yearRange`.
    private static readonly modeNav: Record<
        string,
        {
            stepUnit: CalendarUnit;
            columns: number;
            pageUnit: CalendarUnit;
            pageAmount?: number;
        }
    > = {
        day: {
            stepUnit: "days",
            columns: 7,
            pageUnit: "months",
            pageAmount: 1,
        },
        month: {
            stepUnit: "months",
            columns: 3,
            pageUnit: "years",
            pageAmount: 1,
        },
        year: { stepUnit: "years", columns: 5, pageUnit: "years" },
    };

    // Arrow keys: horizontal = +/-1 unit, vertical = +/-one grid row (columns)
    private static getArrowOffset(
        code: string,
        columns: number
    ): number | undefined {
        switch (code) {
            case KEYBOARD_CODE.ARROW_RIGHT:
                return 1;
            case KEYBOARD_CODE.ARROW_LEFT:
                return -1;
            case KEYBOARD_CODE.ARROW_DOWN:
                return columns;
            case KEYBOARD_CODE.ARROW_UP:
                return -columns;
            default:
                return undefined;
        }
    }

    private static getPageDirection(code: string): number | undefined {
        switch (code) {
            case KEYBOARD_CODE.PAGE_DOWN:
                return 1;
            case KEYBOARD_CODE.PAGE_UP:
                return -1;
            default:
                return undefined;
        }
    }

    private static getEdgeDirection(
        code: string
    ): "start" | "end" | undefined {
        switch (code) {
            case KEYBOARD_CODE.HOME:
                return "start";
            case KEYBOARD_CODE.END:
                return "end";
            default:
                return undefined;
        }
    }

    // True when the key event originates from an editable text field (e.g. the
    // date input), so grid navigation should defer to native caret behavior.
    private static isFromEditableInput(event: KeyboardEvent): boolean {
        const tagName = (event.target as HTMLElement | null)?.tagName;

        return tagName === "INPUT" || tagName === "TEXTAREA";
    }

    private datePickerInner!: DatePickerInnerComponent;
    private dayPicker!: DayPickerComponent;
    private monthPicker?: MonthPickerComponent;
    private yearPicker?: YearPickerComponent;
    private overlay?: OverlayComponent;
    private toggleButton?: HTMLElement;

    public initService(
        datePickerInner: DatePickerInnerComponent,
        dayPicker: DayPickerComponent,
        overlay?: OverlayComponent,
        toggleButton?: HTMLElement,
        monthPicker?: MonthPickerComponent,
        yearPicker?: YearPickerComponent
    ): void {
        this.datePickerInner = datePickerInner;
        this.dayPicker = dayPicker;
        this.overlay = overlay;
        this.toggleButton = toggleButton;
        this.monthPicker = monthPicker;
        this.yearPicker = yearPicker;
    }

    public onKeyDown(event: KeyboardEvent): void {
        // Inline date-pickers have no overlay to open/close - the grid is always considered "open"
        const isOpen = !this.overlay || this.overlay.showing;

        isOpen ? this.handleOpenedCalendar(event) : this.handleClosedCalendar(event);
    }

    private handleClosedCalendar(event: KeyboardEvent): void {
        if (event.code === KEYBOARD_CODE.ARROW_DOWN) {
            event.preventDefault();
            this.overlay?.show();
            this.focusActiveCell();
        }
    }

    private handleOpenedCalendar(event: KeyboardEvent): void {
        const { code } = event;

        if (code === KEYBOARD_CODE.ESCAPE) {
            this.closeAndRestoreFocus();

            return;
        }

        // Let the text input keep its native caret movement - don't hijack the
        // arrow/page keys when the event originates from an editable field.
        if (DatePickerKeyboardService.isFromEditableInput(event)) {
            return;
        }

        const config =
            DatePickerKeyboardService.modeNav[
                this.datePickerInner.datepickerMode
            ];
        if (!config) {
            return;
        }

        const arrowOffset = DatePickerKeyboardService.getArrowOffset(
            code,
            config.columns
        );
        if (arrowOffset !== undefined) {
            event.preventDefault();
            this.moveByStep(arrowOffset, config.stepUnit);

            return;
        }

        const pageDirection = DatePickerKeyboardService.getPageDirection(code);
        if (pageDirection !== undefined) {
            event.preventDefault();
            const amount = config.pageAmount ?? this.datePickerInner.yearRange;
            this.moveByPage(pageDirection * amount, config.pageUnit);

            return;
        }

        // Home/End jump to the first/last cell of the current page (day and month
        // views only; the year view has no natural single edge to jump to).
        const edge = DatePickerKeyboardService.getEdgeDirection(code);
        if (edge !== undefined) {
            const current = this.getActiveDate();
            const next = this.getEdgeDate(current, edge);
            if (next) {
                event.preventDefault();
                this.applyActiveDate(current, next);
            }
        }
    }

    private closeAndRestoreFocus(): void {
        if (!this.overlay) {
            return;
        }

        this.overlay.hide();
        this.toggleButton?.focus();
    }

    // Arrow-key movement: steps by a single grid unit and skips over disabled cells
    private moveByStep(amount: number, unit: CalendarUnit): void {
        const current = this.getActiveDate();
        const next = current.clone().add(amount, unit);

        // Skip over any disabled cells in the direction of travel
        let attempts = 0;
        while (
            this.datePickerInner.isDisabled(next) &&
            attempts < MAX_DISABLED_DATE_SKIPS
        ) {
            next.add(amount, unit);
            attempts++;
        }

        this.applyActiveDate(current, next);
    }

    // PageUp/PageDown movement: jumps a whole page. moment clamps the day-of-month
    // automatically when the target month/year is shorter (e.g. Jan 31 -> Feb 28).
    private moveByPage(amount: number, unit: CalendarUnit): void {
        const current = this.getActiveDate();
        const next = current.clone().add(amount, unit);

        this.applyActiveDate(current, next);
    }

    private applyActiveDate(current: Moment, next: Moment): void {
        const picker = this.datePickerInner;
        const pageChanged = this.getPageId(current) !== this.getPageId(next);

        picker.value = next;
        picker.refreshView();

        if (pageChanged) {
            picker.calendarMoved.next(next);
        }

        this.focusActiveCell();
    }

    // Identifies the page currently shown by the active grid so that calendarMoved
    // only fires when navigation shifts the grid to a different page.
    private getPageId(date: Moment): string {
        switch (this.datePickerInner.datepickerMode) {
            case "month":
                return `${date.year()}`;
            case "year": {
                // The year grid shows a fixed block of `yearRange` years
                const range = this.datePickerInner.yearRange;
                const blockStart =
                    Math.floor((date.year() - 1) / range) * range + 1;

                return `${blockStart}`;
            }
            case "day":
            default:
                return `${date.year()}-${date.month()}`;
        }
    }

    // The first/last cell date of the current page for Home/End (day -> first/last
    // day of the month, month -> January/December). Returns undefined for modes
    // without a supported edge (year).
    private getEdgeDate(
        date: Moment,
        edge: "start" | "end"
    ): Moment | undefined {
        const isStart = edge === "start";

        switch (this.datePickerInner.datepickerMode) {
            case "day":
                return date.clone().date(isStart ? 1 : date.daysInMonth());
            case "month":
                return date.clone().month(isStart ? 0 : 11);
            default:
                return undefined;
        }
    }

    // The date the grid is currently focused on, defaulting to today when unset
    private getActiveDate(): Moment {
        return this.datePickerInner.value
            ? this.datePickerInner.value.clone()
            : moment();
    }

    public focusActiveCell(): void {
        // Wait a tick so the grid has re-rendered before moving DOM focus.
        setTimeout(() => this.getActivePicker()?.focusActiveCell());
    }

    // The picker grid matching the current mode, whose cell should receive focus
    private getActivePicker(): FocusablePicker | undefined {
        switch (this.datePickerInner.datepickerMode) {
            case "month":
                return this.monthPicker;
            case "year":
                return this.yearPicker;
            case "day":
            default:
                return this.dayPicker;
        }
    }
}
