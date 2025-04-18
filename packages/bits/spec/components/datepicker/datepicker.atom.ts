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
import { by, ElementFinder, Key, protractor } from "protractor";

import { Atom } from "../../atom";
import {Helpers} from "../../helpers";
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

    public overlay = Atom.findIn(OverlayAtom, this.getElement());
    public textbox = Atom.findIn(TextboxAtom, this.getElement());

    public selectDate = async (day: number): Promise<void> =>
        this.clickCalendarItem(day.toString());

    public selectMonth = async (month: string): Promise<void> =>
        this.clickCalendarItem(month);

    public selectYear = async (year: number): Promise<void> =>
        this.clickCalendarItem(year.toString());

    public getInput = (): ElementFinder =>
        this.getElement().element(by.css("input.form-control"));

    public isDisabled = async (): Promise<boolean> => this.textbox.disabled();

    public getTextbox(): ElementFinder {
        return this.getElement().element(by.className("nui-textbox"));
    }

    public formatDate(date: Moment, localeDateStringFormat: string): string {
        return date
            .locale(localeDateStringFormat)
            .format(DatepickerAtom.EXPECTED_FORMAT);
    }

    public getInputValue = async (): Promise<string> => {
        const el = this.getInput();
        await Helpers.waitElementVisible(el);
        return el.getAttribute("value");
    };

    public acceptText = async (text: string): Promise<void> =>
        this.getInput().sendKeys(text, protractor.Key.ENTER);

    public clearText = async (): Promise<void> => this.getInput().clear();

    public getMonthElement = (month: string, index?: number): ElementFinder =>
        this.selectButton(month, index);

    public getPopup = (): ElementFinder =>
        this.getElementByCss(".nui-popup__area");

    public getYearElement = (year: string, index?: number): ElementFinder =>
        this.selectButton(year, index);

    public deleteTextManually = async (): Promise<void> =>
        this.getInput().sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);

    /**
     * Gets title which will be after current title is clicked.
     * For example, when daypicker mode is enabled then it gets title of monthpicker.
     * In monthpicker mode gets title of yearpicker.
     * @returns {Promise<string>}
     */
    public async getLargerPeriodTitle(): Promise<string> {
        let newTitle: string;

        return this.getTitleText().then(async (currentTitle) => {
            if (currentTitle.length === 4) {
                const currentYear: number = Math.floor(
                    parseInt(currentTitle, 10)
                );
                const rangeStart: number = currentYear;
                const rangeEnd: number = currentYear + 19;
                newTitle = `${rangeStart} - ${rangeEnd}`;
            } else {
                newTitle = currentTitle.substring(currentTitle.length - 4);
            }

            return newTitle;
        });
    }

    public async clickTitle(): Promise<void> {
        return super
            .getElement()
            .element(by.css("button[id*='title']"))
            .click();
    }

    public clickTodayButton = async (): Promise<void> =>
        this.getElementByCss("button.today-button").click();

    /** @deprecated As of Nova v11, use 'toggle' method instead. Removal: NUI-5865 */
    public clickCalendarIcon = async (): Promise<void> => this.toggle();

    public toggle = async (): Promise<void> => {
        const el = this.getElementByCss(".nui-datepicker__icon");
        await Helpers.waitElementToBeClickable(el);
        await el.click();
    };

    public clickChangeModeButton = async (): Promise<void> =>
        this.getElementByCss(".change-mode-button").click();

    public clickFirstCalendarDate = async (): Promise<void> =>
        this.selectDayButtonByIndex(0).click();

    public isInputValid = async (): Promise<boolean> =>
        !(await this.textbox.hasClass("has-error"));

    public getActiveDay = (): ElementFinder =>
        this.getElementByCss(".btn.selected");

    public getActiveDayText = async (): Promise<string> =>
        this.getElementText(".btn.selected");

    public async getTitleText(): Promise<string> {
        return super
            .getElement()
            .element(by.css("button[id*='title']"))
            .getText();
    }

    public async goNext(): Promise<void> {
        return super
            .getElement()
            .element(by.css("button[icon='caret-right']"))
            .click();
    }

    public async goBack(): Promise<void> {
        return super
            .getElement()
            .element(by.css("button[icon='caret-left']"))
            .click();
    }

    public clickInput = async (): Promise<void> => this.getInput().click();

    public isTodayButtonEnabled = async (): Promise<boolean> =>
        this.getElement().element(by.css("button.today-button")).isEnabled();

    public getMonthFromTitle = async (): Promise<string> =>
        (await this.getTitleText()).split(" ")[0];

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
            .getElement()
            .all(
                by.cssContainingText(
                    "tbody button span:not(.text-muted)",
                    buttonText
                )
            )
            .first();
        return button.click();
    }

    private selectButton(identifier: string, index: number = 0): ElementFinder {
        return super
            .getElement()
            .all(by.cssContainingText(".nui-button span", identifier))
            .get(index);
    }

    private selectDayButtonByIndex(index: number = 0): ElementFinder {
        return super.getElement().all(by.css("td.day .nui-button")).get(index);
    }

    private getElementByCss(identifier: string): ElementFinder {
        // if deep is passed then look in shadow DOM
        return super.getElement().element(by.css(identifier));
    }

    private getElementText = async (identifier: string): Promise<string> =>
        this.getElementByCss(identifier).getText();
}
