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

import moment, { Moment } from "moment/moment";
import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { expect } from "../../setup";
import { OverlayAtom } from "../overlay/overlay.atom";
import { TextboxAtom } from "../textbox/textbox.atom";

export class DatepickerAtom extends Atom {
    public static EXPECTED_FORMAT = "DD MMM YYYY";
    public static CSS_CLASS = "nui-datepicker";
    public static MONTHNAMES_SHORT: string[] = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    public static MONTHNAMES_LONG: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    public get getOverlay(): OverlayAtom {
        return Atom.findIn<OverlayAtom>(OverlayAtom, this.getLocator());
    }

    public textbox = Atom.findIn<TextboxAtom>(TextboxAtom, this.getLocator());

    public selectDate = async (day: number): Promise<void> =>
        this.clickCalendarItem(day.toString());

    public selectMonth = async (month: string): Promise<void> =>
        this.clickCalendarItem(month);

    public selectYear = async (year: number): Promise<void> =>
        this.clickCalendarItem(year.toString());

    public get getInput(): Locator {
        return this.getLocator().locator(`input.form-control`);
    }

    public isDisabled = async (): Promise<boolean> =>
        this.textbox.toBeVisible();

    public get getTextbox() {
        return this.getLocator().locator(`.nui-textbox`);
    }

    public formatDate(date: Moment, localeDateStringFormat: string): string {
        return date
            .locale(localeDateStringFormat)
            .format(DatepickerAtom.EXPECTED_FORMAT);
    }

    public toHaveValue = async (value: string): Promise<void> => {
        const el: Locator = this.getInput;
        await el.isVisible();
        await expect(el).toHaveValue(value);
    };

    public acceptText = async (text: string): Promise<void> => {
        await this.getInput.fill(text);
        await this.getInput.press("Enter");
    };

    public clearText = async (): Promise<void> => this.getInput.clear();

    public getMonthElement = (month: string, index?: number): Locator =>
        this.selectButton(month, index);

    public getYearElement = (year: string, index?: number): Locator =>
        this.selectButton(year, index);

    public deleteTextManually = async (): Promise<void> => {
        await this.getInput.press("Control+a");
        await this.getInput.press("Delete");
    };

    /**
     * Gets title which will be after current title is clicked.
     * For example, when daypicker mode is enabled then it gets title of monthpicker.
     * In monthpicker mode gets title of yearpicker.
     * @returns {Promise<string>}
     */
    public async getLargerPeriodTitle(): Promise<string> {
        let newTitle: string = "";
        const currentTitle = await this.getTitleText.textContent();
        if (currentTitle && currentTitle.length === 4) {
            const currentYear: number = Math.floor(
                parseInt(currentTitle, 10)
            );
            const rangeStart: number = currentYear;
            const rangeEnd: number = currentYear + 19;
            newTitle = `${rangeStart} - ${rangeEnd}`;
        } else if(currentTitle) {
            newTitle = currentTitle.substring(currentTitle.length - 4);
        }

        return newTitle;
    }

    public async clickTitle(): Promise<void> {
        return super.getLocator().locator(`button[id*='title']`).click();
    }

    public clickTodayButton = async (): Promise<void> =>
        this.getLocatorByCss("button.today-button").click();

    /** @deprecated As of Nova v11, use 'toggle' method instead. Removal: NUI-5865 */
    public clickCalendarIcon = async (): Promise<void> => this.toggle();

    public toggle = async (): Promise<void> => {
        const el = this.getLocatorByCss(".nui-datepicker__icon");
        await el.isVisible();
        await el.click();
    };

    public clickChangeModeButton = async (): Promise<void> =>
        this.getLocatorByCss(".change-mode-button").click();

    public clickFirstCalendarDate = async (): Promise<void> =>
        this.selectDayButtonByIndex(0).click();

    public isInputValid = async (): Promise<boolean> =>
        await this.textbox.toNotContainClass("has-error");

    public isNotInputValid = async (): Promise<boolean> =>
        await this.textbox.toContainClass("has-error");

    public get getActiveDay(): Locator {
        return this.getLocatorByCss(".btn.selected");
    }

    public get getActiveDayText(): Locator {
        return this.getLocatorByCss(".btn.selected");
    }

    public get getTitleText(): Locator {
        return super.getLocator().locator("button[id*='title']");
    }

    public async goNext(): Promise<void> {
        return super.getLocator().locator("button[icon='caret-right']").click();
    }

    public async goBack(): Promise<void> {
        return super.getLocator().locator("button[icon='caret-left']").click();
    }

    public clickInput = async (): Promise<void> => this.getInput.click();

    public get todayButton(): Locator {
        return this.getLocator().locator("button.today-button");
    }

    public getMonthFromTitle = async (): Promise<string> =>
        ((await this.getTitleText.textContent()) ?? "").spltest(" ")[0];

    public getPreviousMonthTitle(
        currentMonth: string,
        format: string = "MMMM"
    ): string {
        const previousMonth = moment().month(currentMonth).subtract(1, "month");
        return previousMonth.format(format);
    }

    public getNextMonthTitle(
        currentMonth: string,
        format: string = "MMMM"
    ): string {
        const nextMonth = moment().month(currentMonth).add(1, "month");
        return nextMonth.format(format);
    }

    private async clickCalendarItem(buttonText: string): Promise<void> {
        const button = super
            .getLocator()
            .locator(`tbody button span:not(.text-muted)`)
            .filter({ hasText: buttonText })
            .first();

        return button.click();
    }

    private selectButton(identifier: string, index: number = 0): Locator {
        return super
            .getLocator()
            .locator(".nui-button span")
            .filter({ hasText: identifier })
            .nth(index);
    }

    private selectDayButtonByIndex(index: number = 0): Locator {
        return super.getLocator().locator("td.day .nui-button").nth(index);
    }

    private getLocatorByCss(identifier: string): Locator {
        // if deep is passed then look in shadow DOM
        return super.getLocator().locator(identifier);
    }
}
