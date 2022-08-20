import _isUndefined from "lodash/isUndefined";
import _keys from "lodash/keys";

import { DatePickerInnerComponent } from "./date-picker-inner.component";
import { YearPickerComponent } from "./date-picker-year-picker.component";

describe("components >", () => {
    describe("yearpicker >", () => {
        let inner: DatePickerInnerComponent;
        let yearPicker: YearPickerComponent;

        beforeEach(() => {
            inner = new DatePickerInnerComponent();
            yearPicker = new YearPickerComponent(inner);
        });

        it("should check setting year step", () => {
            expect(_keys(inner.stepYear).length).toBe(0);
            inner.yearRange = 10;
            yearPicker.ngOnInit();
            expect(_keys(inner.stepYear).length).toBe(1);
            expect(inner.stepYear.years).toBe(10);
        });

        it("should check if refreshView handler for year has been set", () => {
            expect(
                _isUndefined((inner as any).refreshViewHandlerYear)
            ).toBeTruthy();
            spyOn(inner, "setRefreshViewHandler");
            spyOn(inner, "setCompareHandler");
            yearPicker.ngOnInit();
            expect(inner.setRefreshViewHandler).toHaveBeenCalled();
            expect(inner.setCompareHandler).toHaveBeenCalled();
        });

        it("should check get starting year", () => {
            inner.yearRange = 10;
            const startingYear = (yearPicker as any).getStartingYear(2018);
            expect(startingYear).toBe(2018);
        });
    });
});
