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

import { Moment } from "moment/moment";
import moment from "moment/moment";

import { DatepickerAtom } from "./datapicker.atom";
import { Atom } from "../../atom";
import { Animations, Helpers, test, expect } from "../../setup";

test.describe("USERCONTROL datepicker", () => {
    const activeDateValueId = "nui-demo-datepicker-active-date-value";
    const activeDateValueIdPreserved =
        "nui-demo-datepicker-active-date-value-preserve";
    const initDateValueIdPreserved =
        "nui-demo-datepicker-init-date-value-preserve";

    let datepickerBasic: DatepickerAtom;
    let datepickerInline: DatepickerAtom;
    let datepickerWithPreserve: DatepickerAtom;
    let datepickerMinMax: DatepickerAtom;
    let datepickerDisabledDates: DatepickerAtom;
    let datepickerDisabledTodayButton: DatepickerAtom;
    let datepickerWithInitAndPreserve: DatepickerAtom;
    let datepickerWithCustomFirstDayOfTheWeek: DatepickerAtom;
    let datepickerWithCustomDateFormat: DatepickerAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("date-picker/date-picker-test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);

        datepickerBasic = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-demo-datepicker-basic"
        );
        datepickerInline = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-demo-datepicker-inline"
        );
        datepickerWithPreserve = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-demo-datepicker-preserve"
        );
        datepickerMinMax = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-demo-datepicker-min-max"
        );
        datepickerDisabledDates = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-demo-datepicker-disabled-dates"
        );
        datepickerDisabledTodayButton = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-demo-datepicker-disabled-today"
        );
        datepickerWithInitAndPreserve = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-demo-datepicker-init-date-preserve"
        );
        datepickerWithCustomFirstDayOfTheWeek = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-demo-datepicker-custom-first-day-of-the-week"
        );
        datepickerWithCustomDateFormat = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-demo-datepicker-custom-date-format"
        );
    });

    test("should show year in title and months in body upon click on title", async () => {
        const currentYear: string = moment().year().toString();
        // Get random month
        const randomMonth = () =>
            DatepickerAtom.MONTHNAMES_SHORT[Math.floor(Math.random() * 12)];
        await datepickerInline.toBeVisible();
        // Go upper level in title
        await datepickerInline.clickTitle();

        await expect(datepickerInline.getTitleText).toHaveText(currentYear);
        await expect(
            datepickerInline.getMonthElement(randomMonth())
        ).toBeVisible();
    });

    test("should have empty input if no value provided", async () => {
        await datepickerDisabledTodayButton.toBeVisible();
        await expect(datepickerDisabledTodayButton.getInput).toHaveValue("");
    });

    test("should not have today selected by default", async () => {
        await datepickerDisabledTodayButton.toggle();
        await expect(datepickerDisabledTodayButton.getActiveDay).toBeHidden();
    });

    test("should change title upon click on next/previous buttons", async () => {
        // define current title and title which should appear upon click on Next button
        const date = moment();
        const currentMonthNumber = date.month();
        const thisYear = date.year();
        const nextYear = currentMonthNumber === 11 ? thisYear + 1 : thisYear; // hack for December
        const previousYear = currentMonthNumber === 0 ? thisYear - 1 : thisYear;

        const currentTitle: string = `${DatepickerAtom.MONTHNAMES_LONG[currentMonthNumber]} ${thisYear}`;
        const nextTitle: string = `${
            DatepickerAtom.MONTHNAMES_LONG[(currentMonthNumber + 1) % 12]
        } ${nextYear}`;
        const previousTitle: string = `${
            DatepickerAtom.MONTHNAMES_LONG[(currentMonthNumber + 11) % 12]
        } ${previousYear}`;

        // initial title
        await expect(datepickerInline.getTitleText).toContainText(currentTitle);
        // go next
        await datepickerInline.goNext();
        // title after click on Next button
        await expect(datepickerInline.getTitleText).toContainText(nextTitle);
        // go back to initial title
        await datepickerInline.goBack();
        // initial title
        await expect(datepickerInline.getTitleText).toContainText(currentTitle);
        // go back to a previous title
        await datepickerInline.goBack();
        // title before the initial one
        await expect(datepickerInline.getTitleText).toContainText(previousTitle);
        // going back to initial state
        await datepickerInline.goNext();
        // verifying we're where we stated and initial title is displayed
        await expect(datepickerInline.getTitleText).toContainText(currentTitle);
    });

    test("should show years in body upon click on title (in state of year)", async () => {
        // go to month picker
        await datepickerInline.clickTitle();
        const nextTitle: any = await datepickerInline.getLargerPeriodTitle();
        const currentYear: string = moment().year().toString();
        // go to year picker
        await datepickerInline.clickTitle();

        await expect( datepickerInline.getTitleText).toContainText(nextTitle);
        await expect(
             datepickerInline.getYearElement(currentYear)
        ).toBeVisible();
    });

    test("should open popup upon click on icon", async () => {
        await datepickerWithPreserve.toggle();
        await datepickerWithPreserve.getOverlay.toBeOpened();
    });

    test("should show datepicker popup upon click on input", async () => {
        await datepickerWithPreserve.clickInput();
        await datepickerWithPreserve.getOverlay.toBeOpened();
    });

    test("should have the same date both on input form and popped up window upon the click on input", async () => {
        const expectedDate: string = "01 Jan 2020";
        const input = datepickerWithPreserve.getInput;
        await datepickerWithPreserve.clearText();
        await datepickerWithPreserve.acceptText(expectedDate);
        // check if value on input is correct
        await expect(input).toHaveValue(expectedDate);

        // click on it
        await datepickerWithPreserve.clickInput();

        await expect(datepickerWithPreserve.getTitleText).toContainText(
            "January 2020"
        );
        // check that correct day is selected
        await expect(datepickerWithPreserve.getActiveDayText).toContainText(
            "1"
        );
    });

    test("should select current date upon click on 'Today'", async () => {
        await datepickerWithPreserve.toggle();
        await datepickerWithPreserve.clickTodayButton();
        await expect(datepickerWithPreserve.getInput).toHaveValue(
            datepickerInline.formatDate(moment(), "en-US")
        );
    });

    test("should correctly change to the selected date", async () => {
        const day: number = 20;
        const date: Moment = moment();
        date.date(day);
        await datepickerWithPreserve.clickInput();
        await datepickerWithPreserve.getOverlay.toBeOpened();

        await datepickerWithPreserve.selectDate(day);
        await expect(datepickerWithPreserve.getInput).toHaveValue(
            datepickerWithPreserve.formatDate(date, "en-US")
        );

        await datepickerWithPreserve.toggle();
        await expect(datepickerWithPreserve.getActiveDayText).toContainText("20");
    });

    test("should close datepicker popup upon click on a date", async () => {
        // open popup by clicking on popup
        await datepickerWithPreserve.clickInput();
        await datepickerWithPreserve.getOverlay.toBeOpened();
        await datepickerWithPreserve.getActiveDay.click();
        await datepickerWithPreserve.getOverlay.toNotBeOpened();
    });

    test.describe("when minDate, maxDate or dateDisabled is set", () => {
        const getMinDate = async () =>
            Atom.find(Atom, "nui-demo-datepicker-min-date")
                .getLocator()
                .textContent();
        const getMaxDate = async () =>
            Atom.find(Atom, "nui-demo-datepicker-max-date")
                .getLocator()
                .textContent();

        test("should forbid selection of date via text input, less than minDate", async () => {
            const minDate: Moment = moment(await getMinDate());
            let date: Moment = moment(minDate);

            date.date(date.date() + 1);
            await datepickerMinMax.toggle();
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(
                datepickerMinMax.formatDate(date, "en-US")
            );

            // min date and larger dates can be selected
            date = moment(minDate);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(
                datepickerMinMax.formatDate(date, "en-US")
            );
            await datepickerMinMax.isInputValid();

            date.date(date.date() + 1);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(
                datepickerMinMax.formatDate(date, "en-US")
            );
            await datepickerMinMax.isInputValid();

            // smaller dates can't be selected
            date = moment(minDate);
            date.date(date.date() - 1);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(
                datepickerMinMax.formatDate(date, "en-US")
            );
            await datepickerMinMax.isNotInputValid();
        });

        test("should forbid selection of date via text input, greater than maxDate", async () => {
            const maxDate: Moment = moment(await getMaxDate());
            let date: Moment = moment(maxDate);

            date.date(date.date() - 1);
            await datepickerMinMax.toggle();
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(
                datepickerMinMax.formatDate(date, "en-US")
            );

            // max date and smaller dates can be selected
            date = moment(maxDate);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(
                datepickerMinMax.formatDate(date, "en-US")
            );
            await datepickerMinMax.isInputValid();

            date.date(date.date() - 1);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(
                datepickerMinMax.formatDate(date, "en-US")
            );
            await datepickerMinMax.isInputValid();

            // larger dates can't be selected
            date = moment(maxDate);
            date.date(date.date() + 1);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(
                datepickerMinMax.formatDate(date, "en-US")
            );
            await datepickerMinMax.isNotInputValid();
        });

        test("should forbid selection via text input of disabled date", async () => {
            const firstInvalidDate = moment().date(10);
            const secondInvalidDate = moment().add(1, "month");
            const thirdInvalidDate = moment().add(1, "year");

            await datepickerDisabledDates.toggle();

            await datepickerDisabledDates.clearText();
            await datepickerDisabledDates.acceptText(
                datepickerDisabledDates.formatDate(firstInvalidDate, "en-US")
            );
            await datepickerDisabledDates.isNotInputValid();

            await datepickerDisabledDates.clearText();
            await datepickerDisabledDates.acceptText(
                datepickerDisabledDates.formatDate(secondInvalidDate, "en-US")
            );
            await datepickerDisabledDates.isNotInputValid();

            await datepickerDisabledDates.clearText();
            await datepickerDisabledDates.acceptText(
                datepickerDisabledDates.formatDate(thirdInvalidDate, "en-US")
            );
            await datepickerDisabledDates.isNotInputValid();
        });

        test("should disable Today button if today date is disabled", async () => {
            await datepickerDisabledTodayButton.toggle();
            await expect(
                datepickerDisabledTodayButton.todayButton
            ).toBeDisabled();
        });
    });

    test.describe("after date selection >", () => {
        test("should change date (saving hours, minutes, seconds)", async () => {
            await datepickerWithPreserve.clickInput();
            await datepickerWithPreserve.selectDate(11);
            await datepickerWithPreserve.toggle();
            const oldValue = await Atom.find(Atom, activeDateValueIdPreserved)
                .getLocator()
                .textContent();
            await datepickerWithPreserve.selectDate(10);
            const newValue = await Atom.find(Atom, activeDateValueIdPreserved)
                .getLocator()
                .textContent();

            expect(newValue).not.toBe(oldValue);

            expect(moment(newValue).hour()).toBe(moment(oldValue).hour());
        });

        test("should change date (NOT saving hours, minutes, seconds)", async () => {
            await datepickerInline.selectDate(11);
            const oldValue = await Atom.find(Atom, activeDateValueId)
                .getLocator()
                .textContent();
            await datepickerInline.selectDate(10);
            const newValue = await Atom.find(Atom, activeDateValueId)
                .getLocator()
                .textContent();

            expect(newValue).not.toBe(oldValue);
            expect(moment(newValue).hour()).toBe(0);
        });
    });

    test.describe("after changing mode >", () => {
        test("should select date and change date (saving hours, minutes, seconds)", async () => {
            await datepickerWithPreserve.clickInput();
            await datepickerWithPreserve.selectDate(5);
            const month = moment().month();
            const monthName = DatepickerAtom.MONTHNAMES_SHORT[month];
            const oldValue = await Atom.find(Atom, activeDateValueIdPreserved)
                .getLocator()
                .textContent();
            await datepickerWithPreserve.clickInput();
            await datepickerWithPreserve.clickTitle();
            await datepickerWithPreserve.selectMonth(monthName);
            await datepickerWithPreserve.selectDate(
                moment().date() > 15 ? 10 : 20
            );
            const newValue = await Atom.find(Atom, activeDateValueIdPreserved)
                .getLocator()
                .textContent();

            expect(newValue).not.toBe(oldValue);
            expect(moment(newValue).hour()).toBe(moment(oldValue).hour());
        });

        test("should select date and change date (NOT saving hours, minutes, seconds)", async () => {
            await datepickerInline.selectDate(5);
            const month = moment().month();
            const monthName = DatepickerAtom.MONTHNAMES_SHORT[month];
            const oldValue = await Atom.find(Atom, activeDateValueId)
                .getLocator()
                .textContent();
            await datepickerInline.clickTitle();
            await datepickerInline.selectMonth(monthName);
            await datepickerInline.selectDate(moment().date() > 15 ? 10 : 20);
            const newValue = await Atom.find(Atom, activeDateValueId)
                .getLocator()
                .textContent();

            expect(newValue).not.toBe(oldValue);
            expect(moment(newValue).hour()).toBe(0);
        });

        test("should save hour correctly when triggered at 23:00 - 0:00", async () => {
            await datepickerWithInitAndPreserve.clickInput();
            await datepickerWithInitAndPreserve.selectDate(5);
            const oldValue = await Atom.find(Atom, initDateValueIdPreserved)
                .getLocator()
                .textContent();
            await datepickerWithInitAndPreserve.clickInput();
            await datepickerWithInitAndPreserve.selectDate(
                moment().date() > 15 ? 10 : 20
            );
            const newValue = await Atom.find(Atom, initDateValueIdPreserved)
                .getLocator()
                .textContent();

            expect(newValue).not.toBe(oldValue);
            expect(moment(newValue).hour()).toBe(moment(oldValue).hour());
        });
    });

    test.describe("after clicking next/previous >", () => {
        test("changes month title appropriately after clicking next/previous", async () => {
            const currentMonth = await datepickerInline.getMonthFromTitle();
            const previousMonth =
                datepickerInline.getPreviousMonthTitle(currentMonth);
            const nextMonth = datepickerInline.getNextMonthTitle(currentMonth);

            await datepickerInline.goBack();
            let updatedCurrentMonth =
                await datepickerInline.getMonthFromTitle();
            expect(updatedCurrentMonth).toEqual(previousMonth);

            await datepickerInline.goNext();
            updatedCurrentMonth = await datepickerInline.getMonthFromTitle();
            expect(updatedCurrentMonth).toEqual(currentMonth);

            await datepickerInline.goNext();
            updatedCurrentMonth = await datepickerInline.getMonthFromTitle();
            expect(updatedCurrentMonth).toEqual(nextMonth);
        });
    });

    test.describe("empty value >", () => {
        test("should build day calendar from the scratch after clicking next and re-open in case of empty value", async ({ page }) => {
            await datepickerBasic.clickInput();
            await datepickerBasic.selectDate(2);
            await datepickerBasic.clickInput();
            await datepickerBasic.deleteTextManually();
            await page.waitForTimeout(501); // mimic debounceTime from inputChanged Observable

            await datepickerBasic.goNext();

            await datepickerBasic.clickInput();
            await datepickerBasic.clickInput();

            const monthInTitle = await datepickerBasic.getMonthFromTitle();
            const momentMonthInTitle = moment().month(monthInTitle);

            expect(momentMonthInTitle.month()).toEqual(moment().month());
        });

        test("should show days calendar after chosing month and re-open", async ({ page }) => {
            await datepickerBasic.clickInput();
            await datepickerBasic.selectDate(2);
            await datepickerBasic.clickInput();
            await datepickerBasic.deleteTextManually();
            await page.waitForTimeout(501); // mimic debounceTime from inputChanged Observable
            await datepickerBasic.clickTitle();

            await datepickerBasic.clickInput();
            await datepickerBasic.clickInput();

            const monthInTitle = await datepickerBasic.getMonthFromTitle();
            const momentMonthInTitle = moment().month(monthInTitle);

            expect(momentMonthInTitle.month()).toEqual(moment().month());
        });
    });

    test("should preserve initial first day of the week in day-picker", async () => {
        await datepickerWithPreserve.clickInput();
        await datepickerWithPreserve.clickFirstCalendarDate();
        let selectedDate = await datepickerWithPreserve.getInput.inputValue();
        let firstDayOfTheWeek = moment(
            moment(selectedDate, "DD MMM YYYY")
        ).day();
        expect(firstDayOfTheWeek).toEqual(0); // 0 is equal to "Sunday"

        await datepickerWithPreserve.clickInput();
        await datepickerWithPreserve.clickChangeModeButton();
        await datepickerWithPreserve.clickChangeModeButton();
        const newYear = moment().add(1, "year").year();
        await datepickerWithPreserve.selectYear(newYear);
        const newMonth =
            moment().month() < 11
                ? moment().add(1, "month").format("MMM")
                : moment().subtract(1, "month").format("MMM");
        await datepickerWithPreserve.selectMonth(newMonth.toString());
        await datepickerWithPreserve.clickFirstCalendarDate();
        selectedDate = await datepickerWithPreserve.getInput.inputValue();
        firstDayOfTheWeek = moment(moment(selectedDate, "DD MMM YYYY")).day();
        expect(firstDayOfTheWeek).toEqual(0);
    });

    test("should correctly set and preserve first day of the week in day-picker", async () => {
        await datepickerWithCustomFirstDayOfTheWeek.clickInput();
        await datepickerWithCustomFirstDayOfTheWeek.clickFirstCalendarDate();
        let selectedDate =
            await datepickerWithCustomFirstDayOfTheWeek.getInput.inputValue();
        let firstDayOfTheWeek = moment(
            moment(selectedDate, "DD MMM YYYY")
        ).day();
        expect(firstDayOfTheWeek).toEqual(5); // 5 is equal to "Friday"

        await datepickerWithCustomFirstDayOfTheWeek.clickInput();
        await datepickerWithCustomFirstDayOfTheWeek.clickChangeModeButton();
        await datepickerWithCustomFirstDayOfTheWeek.clickChangeModeButton();
        const newYear = moment().add(1, "year").year();
        await datepickerWithCustomFirstDayOfTheWeek.selectYear(newYear);
        const newMonth =
            moment().month() < 11
                ? moment().add(1, "month").format("MMM")
                : moment().subtract(1, "month").format("MMM");
        await datepickerWithCustomFirstDayOfTheWeek.selectMonth(
            newMonth.toString()
        );
        await datepickerWithCustomFirstDayOfTheWeek.clickFirstCalendarDate();
        selectedDate =
            await datepickerWithCustomFirstDayOfTheWeek.getInput.inputValue();
        firstDayOfTheWeek = moment(moment(selectedDate, "DD MMM YYYY")).day();
        expect(firstDayOfTheWeek).toEqual(5);
    });

    test("should apply appropriate styles to selected day/month/year on day selection in day-picker", async () => {
        await datepickerInline.toBeVisible();
        await datepickerInline.clickChangeModeButton();
        await datepickerInline.clickChangeModeButton();
        const newYear = moment().add(1, "year").year();
        await datepickerInline.selectYear(newYear);
        const newMonth =
            moment().month() < 11
                ? moment().add(1, "month").format("MMM")
                : moment().subtract(1, "month").format("MMM");
        await datepickerInline.selectMonth(newMonth.toString());
        const newDate = 10;
        await datepickerInline.selectDate(newDate);
        await expect(datepickerInline.getActiveDay).toHaveText(
            newDate.toString()
        );
        await datepickerInline.clickChangeModeButton();
        await expect(datepickerInline.getActiveDay).toHaveText(newMonth);
        await datepickerInline.clickChangeModeButton();
        await expect(datepickerInline.getActiveDay).toHaveText(
            newYear.toString()
        );
    });

    test.describe("datepicker textbox date formatting > ", () => {
        const todayDate: Moment = moment();
        const defaultFormat: string = "DD MMM YYYY";
        const customFormat: string = "MM/DD/YY";
        const todayDateDefaultFormat: string = todayDate.format(defaultFormat);
        const todayDateCustomFormat: string = todayDate.format(customFormat);
        // handling last day of the month properly
        const newDate: Moment =
            todayDate.date() < 15
                ? todayDate.add(1, "day")
                : todayDate.subtract(1, "day");
        const newDateDefaultFormat = newDate.format(defaultFormat);
        const newDateCustomFormat = newDate.format(customFormat);

        test("should display date in textbox in accordance with default dateFormat", async () => {
            await datepickerBasic.toggle();
            await datepickerBasic.clickTodayButton();
            await expect(datepickerBasic.getInput).toHaveValue(
                todayDateDefaultFormat
            );
        });

        test("should display date in textbox in accordance with custom user's dateFormat", async () => {
            await datepickerWithCustomDateFormat.toggle();
            await datepickerWithCustomDateFormat.clickTodayButton();
            await expect(datepickerWithCustomDateFormat.getInput).toHaveValue(
                todayDateCustomFormat
            );
        });

        test("should display selected date in accordance with dateFormat", async () => {
            const newDateDay: number = newDate.date();

            await datepickerBasic.clickInput();
            await datepickerBasic.selectDate(newDateDay);
            await expect(datepickerBasic.getInput).toHaveValue(newDateDefaultFormat);

            await datepickerWithCustomDateFormat.clickInput();
            await datepickerWithCustomDateFormat.selectDate(newDateDay);
            await expect(datepickerWithCustomDateFormat.getInput).toHaveValue(newDateCustomFormat);
        });

        test("should validate typed in date and change it's format in accordance with dateFormat", async () => {
            await datepickerBasic.clearText();
            await datepickerBasic.acceptText(newDateCustomFormat);
            await expect(datepickerBasic.getInput).toHaveValue(newDateDefaultFormat);
            await datepickerBasic.isInputValid();
            await datepickerWithCustomDateFormat.clearText();
            await datepickerWithCustomDateFormat.acceptText(newDateDefaultFormat);
            await expect(datepickerWithCustomDateFormat.getInput).toHaveValue(newDateCustomFormat);
            await datepickerWithCustomDateFormat.isInputValid();
        });

        test("should not validate invalid typed in date and should not change it's format to dateFormat", async () => {
            const invalidDate: string = "20189-50.Nov2";
            await datepickerBasic.toBeVisible();
            await datepickerBasic.clearText();
            await datepickerBasic.acceptText(invalidDate);
            await expect(datepickerBasic.getInput).toHaveValue(invalidDate);
            await datepickerBasic.isInputValid();
            await datepickerWithCustomDateFormat.clearText();
            await datepickerWithCustomDateFormat.acceptText(invalidDate);
            await expect(datepickerWithCustomDateFormat.getInput).toHaveValue(invalidDate);
            await datepickerWithCustomDateFormat.isNotInputValid();
        });
    });
});
