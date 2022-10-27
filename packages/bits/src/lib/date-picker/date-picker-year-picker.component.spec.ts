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
