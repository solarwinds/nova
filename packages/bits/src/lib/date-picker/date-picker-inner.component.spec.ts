import _noop from "lodash/noop";
import moment from "moment/moment";
import { Moment } from "moment/moment";

import { DatePickerInnerComponent } from "./date-picker-inner.component";

describe("components >", () => {
    describe("date-picker-inner >", () => {
        let inner: DatePickerInnerComponent;

        beforeEach(() => {
            inner = new DatePickerInnerComponent();
        });

        it("should check changes on init", () => {
            expect((inner as any).uniqueId).toBeUndefined();
            expect(inner.value).toBeUndefined();

            const newDate = moment();
            inner.initDate = newDate;
            spyOn(inner.selectionDone, "emit");
            spyOn(inner.update, "emit");
            inner.ngOnInit();
            expect((inner as any).uniqueId).toContain("date-picker");
            expect(inner.value?.isSame(newDate, "day")).toBe(true);
            expect(inner.selectionDone.emit).toHaveBeenCalled();
            expect(inner.update.emit).toHaveBeenCalled();
        });

        it("should check on changes handler", () => {
            const value = moment();
            spyOn(inner, "refreshView");
            inner.datepickerMode = "day";
            inner.selectedDate = value.clone().subtract(1, "day");
            inner.ngOnChanges({
                value: {
                    previousValue: value.clone().subtract(1, "day"),
                    currentValue: value,
                    firstChange: false,
                    isFirstChange: () => false,
                },
            });
            expect(inner.refreshView).toHaveBeenCalled();
        });

        it("should check emit callback on active date update", () => {
            spyOn(inner.update, "emit");
            const selectedDate = moment().toISOString();
            inner.select(selectedDate, new MouseEvent("click"));
            expect(inner.update.emit).toHaveBeenCalled();
        });

        it("should set compare handler", () => {
            expect((inner as any).compareHandlerDay).toBeUndefined();
            inner.setCompareHandler(_noop, "day");
            expect((inner as any).compareHandlerDay).toBeDefined();
        });

        describe("should compare two dates > ", () => {
            it("one of dates is undefined", () => {
                // @ts-ignore: Suppressing error for testing purposes
                const compareResult = inner.compare(undefined, moment());
                expect(compareResult).toBeUndefined();
            });

            it("return result of handler", () => {
                inner.datepickerMode = "day";
                inner.setCompareHandler((a: Date, b: Date) => 1, "day");
                expect((inner as any).compareHandlerDay).toBeDefined();
                const compareResult = inner.compare(moment({year: 2018, month: 0, day: 1}), moment({year: 2018, month: 0, day: 2}));
                expect(compareResult).toBe(1);
            });

            it("return undefined with defined dates but undefined mode", () => {
                const compareResult = inner.compare(moment({year: 2018, month: 0, day: 1}), moment({year: 2018, month: 0, day: 2}));
                expect(compareResult).toBeUndefined();
            });
        });

        it("should set refreshView handler", () => {
            expect((inner as any).refreshViewHandlerDay).toBeUndefined();
            inner.setRefreshViewHandler(_noop, "day");
            expect((inner as any).refreshViewHandlerDay).toBeDefined();
        });

        it("should call refreshView", () => {
            inner.setRefreshViewHandler(_noop, "day");
            expect((inner as any).refreshViewHandlerDay).toBeDefined();
            inner.datepickerMode = "day";
            spyOn((inner as any), "refreshViewHandlerDay");
            inner.refreshView();
            expect((inner as any).refreshViewHandlerDay).toHaveBeenCalled();
        });

        it("should create date object (saving hours/minutes/seconds)", () => {
            inner.preserveInsignificant = true;
            const date = moment();
            const dateObj = inner.createDateObject(date, "MM/dd/yy");
            expect(dateObj).toBeDefined();
            expect(moment(dateObj.date) instanceof moment).toBeTruthy();
            expect(moment(dateObj.date).hour()).toBe(date.hour());
            expect(moment(dateObj.date).minute()).toBe(date.minute());
        });

        it("should trigger selection callback on select", () => {
            inner.datepickerMode = "day";
            inner.minMode = "day";
            inner.value = moment();
            spyOn(inner.selectionDone, "emit");
            inner.select(moment().toISOString(), new Event("click"));
            expect(inner.selectionDone.emit).toHaveBeenCalled();
        });

        it("should NOT trigger selection callback on select", () => {
            spyOn(inner.selectionDone, "emit");
            inner.datepickerMode = "day";
            inner.value = moment();
            inner.select(moment().toISOString(), new Event("click"));
            expect(inner.selectionDone.emit).not.toHaveBeenCalled();
        });

        it("should trigger active date change callback on move", () => {
            inner.datepickerMode = "day";
            inner.value = moment();
            spyOn(inner, "refreshView");
            inner.move(1, new MouseEvent("click"));
            expect(inner.refreshView).toHaveBeenCalled();
        });

        it("should emit on callendar move", () => {
            inner.datepickerMode = "day";
            inner.value = moment();
            spyOn(inner.calendarMoved, "next");

            inner.move(1, new MouseEvent("click"));

            expect(inner.calendarMoved.next).toHaveBeenCalled();
        });

        it("should correctly update date if month is moved", () => {
            inner.datepickerMode = "day";
            inner.stepDay = {months: 1};
            inner.value = moment();
            const oldDate = inner.value;

            inner.move(-1, new MouseEvent("click"));

            expect(inner.value).not.toEqual(oldDate);
        });

        it("should not refresh view on mode toggle (mode is equal to max mode)", () => {
            inner.datepickerMode = "day";
            inner.maxMode = "day";
            spyOn(inner, "refreshView");
            inner.toggleMode(new Event("click"), undefined);
            expect(inner.refreshView).not.toHaveBeenCalled();
        });

        it("should not refresh view on mode toggle (mode is equal to min mode)", () => {
            inner.datepickerMode = "day";
            inner.minMode = "day";
            spyOn(inner, "refreshView");
            inner.toggleMode(new Event("click"), -1);
            expect(inner.refreshView).not.toHaveBeenCalled();
        });

        it("should refresh view on mode toggle", () => {
            inner.datepickerMode = "day";
            spyOn(inner, "refreshView");
            inner.toggleMode(new Event("click"), -1);
            expect(inner.refreshView).toHaveBeenCalled();
        });

        describe("should compare date disabled", () => {
            it("result 1 as in custom handler", () => {
                inner.setCompareHandler((a: Moment, b: Moment) => 1, "day");
                const isDateDisabled = (inner as any).compareDateDisabled({date: moment(), mode: "day"}, moment());
                expect(isDateDisabled).toBe(1);
            });

            it("result is undefined, one of the dates is undefined", () => {
                const isDateDisabled = (inner as any).compareDateDisabled(undefined, moment());
                expect(isDateDisabled).toBeUndefined();
            });

            it("result is undefined", () => {
                const isDateDisabled = (inner as any).compareDateDisabled({date: moment(), mode: "day"}, moment());
                expect(isDateDisabled).toBeUndefined();
            });
        });

        describe("should check if date is disabled", () => {
            it("disable dates array is not defined", () => {
                expect((inner as any).isDisabled()).toBeUndefined();
            });

            it("returns true: max date is set", () => {
                inner.disabledDates = [{
                    date: moment(),
                    mode: "day",
                }];
                spyOn((inner as any), "compareDateDisabled").and.returnValue(0);
                spyOn((inner as any), "compare").and.returnValue(1);
                inner.maxDate = moment();
                expect((inner as any).isDisabled()).toBeTruthy();
            });

            it("returns true: min date is set", () => {
                inner.disabledDates = [{
                    date: moment(),
                    mode: "day",
                }];
                spyOn((inner as any), "compareDateDisabled").and.returnValue(0);
                spyOn((inner as any), "compare").and.returnValue(-1);
                inner.maxDate = moment();
                expect((inner as any).isDisabled()).toBeTruthy();
            });
        });

        it("should call refreshView on AfterContentInit", () => {
            spyOn(inner, "refreshView");
            inner.ngAfterContentInit();
            expect(inner.refreshView).toHaveBeenCalled();
        });
    });
});
