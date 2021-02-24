import { Moment } from "moment/moment";
import moment from "moment/moment";
import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";

import { DatepickerAtom } from "./datepicker.atom";

describe("USERCONTROL datepicker", () => {
    const activeDateValueId = "nui-demo-datepicker-active-date-value";
    const activeDateValueIdPreserved = "nui-demo-datepicker-active-date-value-preserve";
    const initDateValueIdPreserved = "nui-demo-datepicker-init-date-value-preserve";

    let datepickerBasic: DatepickerAtom;
    let datepickerInline: DatepickerAtom;
    let datepickerWithPreserve: DatepickerAtom;
    let datepickerMinMax: DatepickerAtom;
    let datepickerReactive: DatepickerAtom;
    let datepickerDisabledDates: DatepickerAtom;
    let datepickerDisabledTodayButton: DatepickerAtom;
    let datepickerWithInitAndPreserve: DatepickerAtom;
    let datepickerWithCustomFirstDayOfTheWeek: DatepickerAtom;
    let datepickerWithCustomDateFormat: DatepickerAtom;

    beforeEach(async () => {
        await Helpers.prepareBrowser("date-picker/date-picker-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        datepickerBasic = Atom.find(DatepickerAtom, "nui-demo-datepicker-basic");
        datepickerInline = Atom.find(DatepickerAtom, "nui-demo-datepicker-inline");
        datepickerWithPreserve = Atom.find(DatepickerAtom, "nui-demo-datepicker-preserve");
        datepickerMinMax = Atom.find(DatepickerAtom, "nui-demo-datepicker-min-max");
        datepickerReactive = Atom.find(DatepickerAtom, "nui-demo-date-picker-reactive");
        datepickerDisabledDates = Atom.find(DatepickerAtom, "nui-demo-datepicker-disabled-dates");
        datepickerDisabledTodayButton = Atom.find(DatepickerAtom, "nui-demo-datepicker-disabled-today");
        datepickerWithInitAndPreserve = Atom.find(DatepickerAtom, "nui-demo-datepicker-init-date-preserve");
        datepickerWithCustomFirstDayOfTheWeek = Atom.find(DatepickerAtom, "nui-demo-datepicker-custom-first-day-of-the-week");
        datepickerWithCustomDateFormat = Atom.find(DatepickerAtom, "nui-demo-datepicker-custom-date-format");
    });

    it("should show year in title and months in body upon click on title", async () => {
        const currentYear: string = moment().year().toString();
        // Get random month
        const randomMonth = () => DatepickerAtom.MONTHNAMES_SHORT[Math.floor(Math.random() * 12)];
        // Go upper level in title
        await datepickerInline.clickTitle();

        expect(await datepickerInline.getTitleText()).toEqual(currentYear);
        expect(await datepickerInline.getMonthElement(randomMonth()).isPresent()).toBe(true);
    });

    it("should have empty input if no value provided", async () => {
        expect(await datepickerDisabledTodayButton.getInputValue()).toEqual("");
    });

    it("should not have today selected by default", async () => {
        await datepickerDisabledTodayButton.toggle();
        expect(await datepickerDisabledTodayButton.getActiveDay().isPresent()).toBe(false);
    });

    it("should change title upon click on next/previous buttons", async () => {
        // define current title and title which should appear upon click on Next button
        const date = moment();
        const currentMonthNumber = date.month();
        const thisYear = date.year();
        const nextYear = currentMonthNumber === 11 ? thisYear + 1 : thisYear; // hack for December
        const previousYear = currentMonthNumber === 0 ? thisYear - 1 : thisYear;

        const currentTitle: string = `${DatepickerAtom.MONTHNAMES_LONG[currentMonthNumber]} ${thisYear}`;
        const nextTitle: string = `${DatepickerAtom.MONTHNAMES_LONG[(currentMonthNumber + 1) % 12]} ${nextYear}`;
        const previousTitle: string = `${DatepickerAtom.MONTHNAMES_LONG[(currentMonthNumber + 11) % 12]} ${previousYear}`;

        // initial title
        expect(await datepickerInline.getTitleText()).toEqual(currentTitle);
        // go next
        await datepickerInline.goNext();
        // title after click on Next button
        expect(await datepickerInline.getTitleText()).toEqual(nextTitle);
        // go back to initial title
        await datepickerInline.goBack();
        // initial title
        expect(await datepickerInline.getTitleText()).toEqual(currentTitle);
        // go back to a previous title
        await datepickerInline.goBack();
        // title before the initial one
        await expect(datepickerInline.getTitleText()).toEqual(previousTitle);
        // going back to initial state
        await datepickerInline.goNext();
        // verifying we're where we stated and initial title is displayed
        expect(await datepickerInline.getTitleText()).toEqual(currentTitle);
    });

    it("should show years in body upon click on title (in state of year)", async () => {
        // go to month picker
        await datepickerInline.clickTitle();
        const nextTitle: any = await datepickerInline.getLargerPeriodTitle();
        const currentYear: string = moment().year().toString();
        // go to year picker
        await datepickerInline.clickTitle();

        expect(await datepickerInline.getTitleText()).toEqual(nextTitle);
        expect(await datepickerInline.getYearElement(currentYear).isPresent()).toBe(true);
    });

    it("should open popup upon click on icon", async () => {
        await datepickerWithPreserve.toggle();
        expect(await datepickerWithPreserve.overlay.isOpened()).toBe(true);
    });

    it("should show datepicker popup upon click on input", async () => {
        await datepickerWithPreserve.clickInput();
        expect(await datepickerWithPreserve.overlay.isOpened()).toBe(true);
    });

    it("should have the same date both on input form and popped up window upon the click on input", async () => {
        const expectedDate: string = "01 Jan 2020";
        const input = datepickerWithPreserve.getInput();
        await datepickerWithPreserve.clearText();
        await datepickerWithPreserve.acceptText(expectedDate);
        // check if value on input is correct
        expect(await input.getAttribute("value")).toEqual(expectedDate);

        // click on it
        await datepickerWithPreserve.clickInput();

        expect(await datepickerWithPreserve.getTitleText()).toEqual("January 2020");
        // check that correct day is selected
        expect(await datepickerWithPreserve.getActiveDayText()).toEqual("1");
    });

    it("should select current date upon click on 'Today'", async () => {
        await datepickerWithPreserve.toggle();
        await datepickerWithPreserve.clickTodayButton();
        expect(await datepickerWithPreserve.getInputValue()).toEqual(datepickerInline.formatDate(moment(), "en-US"));
    });

    it("should correctly change to the selected date", async () => {
        const day: number = 20;
        const date: Moment = moment();
        date.date(day);
        await datepickerWithPreserve.clickInput();
        expect(await datepickerWithPreserve.overlay.isOpened()).toBe(true);

        await datepickerWithPreserve.selectDate(day);
        expect(await datepickerWithPreserve.getInputValue()).toEqual(datepickerWithPreserve.formatDate(date, "en-US"));

        await datepickerWithPreserve.toggle();
        expect(await datepickerWithPreserve.getActiveDayText()).toEqual("20");
    });

    it("should close datepicker popup upon click on a date", async () => {
        // open popup by clicking on popup
        await datepickerWithPreserve.clickInput();
        expect(await datepickerWithPreserve.overlay.isOpened()).toBe(true);
        await datepickerWithPreserve.getActiveDay().click();
        expect(await datepickerWithPreserve.overlay.isOpened()).toBe(false);
    });

    describe("when minDate, maxDate or dateDisabled is set", () => {
        async function getMinDate() {
            return browser.element(by.id("nui-demo-datepicker-min-date")).getText();
        }

        async function getMaxDate(): Promise<string> {
            return browser.element(by.id("nui-demo-datepicker-max-date")).getText();
        }

        it("should forbid selection of date via text input, less than minDate", async () => {
            const minDate: Moment = moment(await getMinDate());
            let date: Moment = moment(minDate);

            date.date(date.date() + 1);
            await datepickerMinMax.toggle();
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(datepickerMinMax.formatDate(date, "en-US"));

            // min date and larger dates can be selected
            date = moment(minDate);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(datepickerMinMax.formatDate(date, "en-US"));
            expect(await datepickerMinMax.isInputValid()).toEqual(true);

            date.date(date.date() + 1);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(datepickerMinMax.formatDate(date, "en-US"));
            expect(await datepickerMinMax.isInputValid()).toEqual(true);

            // smaller dates can't be selected
            date = moment(minDate);
            date.date(date.date() - 1);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(datepickerMinMax.formatDate(date, "en-US"));
            expect(await datepickerMinMax.isInputValid()).toEqual(false);
        });

        it("should forbid selection of date via text input, greater than maxDate", async () => {
            const maxDate: Moment = moment(await getMaxDate());
            let date: Moment = moment(maxDate);

            date.date(date.date() - 1);
            await datepickerMinMax.toggle();
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(datepickerMinMax.formatDate(date, "en-US"));

            // max date and smaller dates can be selected
            date = moment(maxDate);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(datepickerMinMax.formatDate(date, "en-US"));
            expect(await datepickerMinMax.isInputValid()).toEqual(true);

            date.date(date.date() - 1);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(datepickerMinMax.formatDate(date, "en-US"));
            expect(await datepickerMinMax.isInputValid()).toEqual(true);

            // larger dates can't be selected
            date = moment(maxDate);
            date.date(date.date() + 1);
            await datepickerMinMax.clearText();
            await datepickerMinMax.acceptText(datepickerMinMax.formatDate(date, "en-US"));
            expect(await datepickerMinMax.isInputValid()).toEqual(false);
        });

        it("should forbid selection via text input of disabled date", async () => {
            const firstInvalidDate = moment().date(10);
            const secondInvalidDate = moment().add(1, "month");
            const thirdInvalidDate = moment().add(1, "year");

            await datepickerDisabledDates.toggle();

            await datepickerDisabledDates.clearText();
            await datepickerDisabledDates.acceptText(datepickerDisabledDates.formatDate(firstInvalidDate, "en-US"));
            expect(await datepickerDisabledDates.isInputValid()).toEqual(false);

            await datepickerDisabledDates.clearText();
            await datepickerDisabledDates.acceptText(datepickerDisabledDates.formatDate(secondInvalidDate, "en-US"));
            expect(await datepickerDisabledDates.isInputValid()).toEqual(false);

            await datepickerDisabledDates.clearText();
            await datepickerDisabledDates.acceptText(datepickerDisabledDates.formatDate(thirdInvalidDate, "en-US"));
            expect(await datepickerDisabledDates.isInputValid()).toEqual(false);
        });

        it("should disable Today button if today date is disabled", async () => {
            await datepickerDisabledTodayButton.toggle();
            expect (await datepickerDisabledTodayButton.isTodayButtonEnabled()).toEqual(false);
        });
    });

    describe("after date selection >", () => {
        it("should change date (saving hours, minutes, seconds)", async () => {
            await datepickerWithPreserve.clickInput();
            await datepickerWithPreserve.selectDate(11);
            await datepickerWithPreserve.toggle();
            const oldValue = await browser.element(by.id(activeDateValueIdPreserved)).getText();
            await datepickerWithPreserve.selectDate(10);
            const newValue = await browser.element(by.id(activeDateValueIdPreserved)).getText();

            expect(newValue).not.toBe(oldValue);
            expect(moment(newValue).hour()).toBe(moment(oldValue).hour());
        });

        it("should change date (NOT saving hours, minutes, seconds)", async () => {
            await datepickerInline.selectDate(11);
            const oldValue = await browser.element(by.id(activeDateValueId)).getText();
            await datepickerInline.selectDate(10);
            const newValue = await browser.element(by.id(activeDateValueId)).getText();

            expect(newValue).not.toBe(oldValue);
            expect(moment(newValue).hour()).toBe(0);
        });
    });

    describe("after changing mode >", () => {
        it("should select date and change date (saving hours, minutes, seconds)", async () => {
            await datepickerWithPreserve.clickInput();
            await datepickerWithPreserve.selectDate(5);
            const month = moment().month();
            const monthName = DatepickerAtom.MONTHNAMES_SHORT[month];
            const oldValue = await browser.element(by.id(activeDateValueIdPreserved)).getText();
            await datepickerWithPreserve.clickInput();
            await datepickerWithPreserve.clickTitle();
            await datepickerWithPreserve.selectMonth(monthName);
            await datepickerWithPreserve.selectDate(moment().date() > 15 ? 10 : 20);
            const newValue = await browser.element(by.id(activeDateValueIdPreserved)).getText();

            expect(newValue).not.toBe(oldValue);
            expect(moment(newValue).hour()).toBe(moment(oldValue).hour());
        });

        it("should select date and change date (NOT saving hours, minutes, seconds)", async () => {
            await datepickerInline.selectDate(5);
            const month = moment().month();
            const monthName = DatepickerAtom.MONTHNAMES_SHORT[month];
            const oldValue = await browser.element(by.id(activeDateValueId)).getText();
            await datepickerInline.clickTitle();
            await datepickerInline.selectMonth(monthName);
            await datepickerInline.selectDate(moment().date() > 15 ? 10 : 20);
            const newValue = await browser.element(by.id(activeDateValueId)).getText();

            expect(newValue).not.toBe(oldValue);
            expect(moment(newValue).hour()).toBe(0);
        });

        it("should save hour correctly when triggered at 23:00 - 0:00", async() => {
            await datepickerWithInitAndPreserve.clickInput();
            await datepickerWithInitAndPreserve.selectDate(5);
            const oldValue = await browser.element(by.id(initDateValueIdPreserved)).getText();
            await datepickerWithInitAndPreserve.clickInput();
            await datepickerWithInitAndPreserve.selectDate(moment().date() > 15 ? 10 : 20);
            const newValue = await browser.element(by.id(initDateValueIdPreserved)).getText();

            expect(newValue).not.toBe(oldValue);
            expect(moment(newValue).hour()).toBe(moment(oldValue).hour());
        });
    });

    describe("after clicking next/previous >", () => {
        it("changes month title appropriately after clicking next/previous", async () => {
            const currentMonth = await datepickerInline.getMonthFromTitle();
            const previousMonth = datepickerInline.getPreviousMonthTitle(currentMonth);
            const nextMonth = datepickerInline.getNextMonthTitle(currentMonth);

            await datepickerInline.goBack();
            let updatedCurrentMonth = await datepickerInline.getMonthFromTitle();
            expect(updatedCurrentMonth).toEqual(previousMonth);

            await datepickerInline.goNext();
            updatedCurrentMonth = await datepickerInline.getMonthFromTitle();
            expect(updatedCurrentMonth).toEqual(currentMonth);

            await datepickerInline.goNext();
            updatedCurrentMonth = await datepickerInline.getMonthFromTitle();
            expect(updatedCurrentMonth).toEqual(nextMonth);
        });
    });

    describe("empty value >", () => {
        it("should build day calendar from the scratch after clicking next and re-open in case of empty value", async () => {
            await datepickerBasic.clickInput();
            await datepickerBasic.selectDate(2);
            await datepickerBasic.clickInput();
            await datepickerBasic.deleteTextManually();
            await browser.sleep(501); // 'inputChanged' Observable debounceTime
            await datepickerBasic.goNext();

            await datepickerBasic.clickInput();
            await datepickerBasic.clickInput();

            const monthInTitle = await datepickerBasic.getMonthFromTitle();
            const momentMonthInTitle = moment().month(monthInTitle);

            expect(momentMonthInTitle.month()).toEqual(moment().month());
        });

        it("should show days calendar after chosing month and re-open", async () => {
            await datepickerBasic.clickInput();
            await datepickerBasic.selectDate(2);
            await datepickerBasic.clickInput();
            await datepickerBasic.deleteTextManually();
            await browser.sleep(501); // 'inputChanged' Observable debounceTime
            await datepickerBasic.clickTitle();

            await datepickerBasic.clickInput();
            await datepickerBasic.clickInput();

            const monthInTitle = await datepickerBasic.getMonthFromTitle();
            const momentMonthInTitle = moment().month(monthInTitle);

            expect(momentMonthInTitle.month()).toEqual(moment().month());
        });
    });

    it("should preserve initial first day of the week in day-picker", async () => {
        await datepickerWithPreserve.clickInput();
        await datepickerWithPreserve.clickFirstCalendarDate();
        let selectedDate = await datepickerWithPreserve.getInputValue();
        let firstDayOfTheWeek = moment(moment(selectedDate, "DD MMM YYYY")).day();
        expect(firstDayOfTheWeek).toEqual(0); // 0 is equal to "Sunday"

        await datepickerWithPreserve.clickInput();
        await datepickerWithPreserve.clickChangeModeButton();
        await datepickerWithPreserve.clickChangeModeButton();
        const newYear = moment().add(1, "year").year();
        await datepickerWithPreserve.selectYear(newYear);
        const newMonth = (moment().month() < 11)
            ? moment().add(1, "month").format("MMM")
            : moment().subtract(1, "month").format("MMM");
        await datepickerWithPreserve.selectMonth(newMonth.toString());
        await datepickerWithPreserve.clickFirstCalendarDate();
        selectedDate = await datepickerWithPreserve.getInputValue();
        firstDayOfTheWeek = moment(moment(selectedDate, "DD MMM YYYY")).day();
        expect(firstDayOfTheWeek).toEqual(0);
    });

    it("should correctly set and preserve first day of the week in day-picker", async () => {
        await datepickerWithCustomFirstDayOfTheWeek.clickInput();
        await datepickerWithCustomFirstDayOfTheWeek.clickFirstCalendarDate();
        let selectedDate = await datepickerWithCustomFirstDayOfTheWeek.getInputValue();
        let firstDayOfTheWeek = moment(moment(selectedDate, "DD MMM YYYY")).day();
        expect(firstDayOfTheWeek).toEqual(5); // 5 is equal to "Friday"

        await datepickerWithCustomFirstDayOfTheWeek.clickInput();
        await datepickerWithCustomFirstDayOfTheWeek.clickChangeModeButton();
        await datepickerWithCustomFirstDayOfTheWeek.clickChangeModeButton();
        const newYear = moment().add(1, "year").year();
        await datepickerWithCustomFirstDayOfTheWeek.selectYear(newYear);
        const newMonth = (moment().month() < 11)
            ? moment().add(1, "month").format("MMM")
            : moment().subtract(1, "month").format("MMM");
        await datepickerWithCustomFirstDayOfTheWeek.selectMonth(newMonth.toString());
        await datepickerWithCustomFirstDayOfTheWeek.clickFirstCalendarDate();
        selectedDate = await datepickerWithCustomFirstDayOfTheWeek.getInputValue();
        firstDayOfTheWeek = moment(moment(selectedDate, "DD MMM YYYY")).day();
        expect(firstDayOfTheWeek).toEqual(5);
    });

    it("should apply appropriate styles to selected day/month/year on day selection in day-picker", async () => {
        await datepickerInline.clickChangeModeButton();
        await datepickerInline.clickChangeModeButton();
        const newYear = moment().add(1, "year").year();
        await datepickerInline.selectYear(newYear);
        const newMonth = (moment().month() < 11)
            ? moment().add(1, "month").format("MMM")
            : moment().subtract(1, "month").format("MMM");
        await datepickerInline.selectMonth(newMonth.toString());
        const newDate = 10;
        await datepickerInline.selectDate(newDate);
        expect(await datepickerInline.getActiveDayText()).toEqual(newDate.toString());
        await datepickerInline.clickChangeModeButton();
        expect(await datepickerInline.getActiveDayText()).toEqual(newMonth);
        await datepickerInline.clickChangeModeButton();
        expect(await datepickerInline.getActiveDayText()).toEqual(newYear.toString());
    });

    describe("datepicker textbox date formatting > ", () => {
        const todayDate: Moment = moment();
        const defaultFormat: string = "DD MMM YYYY";
        const customFormat: string = "MM/DD/YY";
        const todayDateDefaultFormat: string = todayDate.format(defaultFormat);
        const todayDateCustomFormat: string = todayDate.format(customFormat);
        // handling last day of the month properly
        const newDate: Moment = todayDate.date() < 15
            ? todayDate.add(1, "day")
            : todayDate.subtract(1, "day");
        const newDateDefaultFormat = newDate.format(defaultFormat);
        const newDateCustomFormat = newDate.format(customFormat);

        it("should display date in textbox in accordance with default dateFormat", async () => {
            await datepickerBasic.toggle();
            await datepickerBasic.clickTodayButton();
            expect(await datepickerBasic.getInputValue()).toEqual(todayDateDefaultFormat);
        });

        it("should display date in textbox in accordance with custom user's dateFormat", async () => {
            await datepickerWithCustomDateFormat.toggle();
            await datepickerWithCustomDateFormat.clickTodayButton();
            expect(await datepickerWithCustomDateFormat.getInputValue()).toEqual(todayDateCustomFormat);
        });

        it("should display selected date in accordance with dateFormat", async () => {
            const newDateDay: number = newDate.date();

            await datepickerBasic.clickInput();
            await datepickerBasic.selectDate(newDateDay);
            let selectedDate: string = await datepickerBasic.getInputValue();
            expect(selectedDate).toEqual(newDateDefaultFormat);

            await datepickerWithCustomDateFormat.clickInput();
            await datepickerWithCustomDateFormat.selectDate(newDateDay);
            selectedDate = await datepickerWithCustomDateFormat.getInputValue();
            expect(selectedDate).toEqual(newDateCustomFormat);
        });

        it("should validate typed in date and change it's format in accordance with dateFormat", async () => {
            await datepickerBasic.clearText();
            await datepickerBasic.acceptText(newDateCustomFormat);
            let selectedDate = await datepickerBasic.getInputValue();
            expect(selectedDate).toEqual(newDateDefaultFormat);
            expect(await datepickerBasic.isInputValid()).toEqual(true);

            await datepickerWithCustomDateFormat.clearText();
            await datepickerWithCustomDateFormat.acceptText(newDateDefaultFormat);
            selectedDate = await datepickerWithCustomDateFormat.getInputValue();
            expect(selectedDate).toEqual(newDateCustomFormat);
            expect(await datepickerWithCustomDateFormat.isInputValid()).toEqual(true);
        });

        it("should not validate invalid typed in date and should not change it's format to dateFormat", async () => {
            const invalidDate: string = "20189-50.Nov2";

            await datepickerBasic.clearText();
            await datepickerBasic.acceptText(invalidDate);
            let selectedDate = await datepickerBasic.getInputValue();
            expect(selectedDate).toEqual(invalidDate);
            expect(await datepickerBasic.isInputValid()).toEqual(false);

            await datepickerWithCustomDateFormat.clearText();
            await datepickerWithCustomDateFormat.acceptText(invalidDate);
            selectedDate = await datepickerWithCustomDateFormat.getInputValue();
            expect(selectedDate).toEqual(invalidDate);
            expect(await datepickerWithCustomDateFormat.isInputValid()).toEqual(false);
        });
    });
});
