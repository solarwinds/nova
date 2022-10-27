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

import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { NuiDashboardsModule } from "../../../../dashboards.module";
import { NuiPizzagnaModule } from "../../../../pizzagna/pizzagna.module";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { SiUnitsFormatterComponent } from "./si-units-formatter.component";

const TEST_DATA: any[] = [
    {
        input: {
            value: 0,
        },
        expected: {
            value: "0",
            modifier: undefined,
        },
    },
    {
        input: {
            value: 1,
        },
        expected: {
            value: "1",
            modifier: undefined,
        },
    },
    {
        input: {
            value: -1,
        },
        expected: {
            value: "-1",
            modifier: undefined,
        },
    },
    {
        input: {
            value: -1,
        },
        expected: {
            value: "-1",
            modifier: undefined,
        },
    },
    {
        input: {
            value: 11234,
        },
        expected: {
            value: "11.2",
            modifier: "k",
        },
    },
    {
        input: {
            value: 2000000,
        },
        expected: {
            value: "2",
            modifier: "M",
        },
    },
    {
        input: {
            value: 5000000002,
        },
        expected: {
            value: "5",
            modifier: "G",
        },
    },
    {
        input: {
            value: -3472364782,
        },
        expected: {
            value: "-3.5",
            modifier: "G",
        },
    },
    {
        input: {
            value: "-445646546546540.25",
        },
        expected: {
            value: "-445.6",
            modifier: "T",
        },
    },
    {
        input: {
            value: "-445646546546540.25",
        },
        expected: {
            value: "-445.6",
            modifier: "T",
        },
    },
    {
        input: {
            value: "0.0000564564654654",
        },
        expected: {
            value: "56.5",
            modifier: "µ",
        },
    },
    {
        input: {
            value: "0.000000000564564654654",
        },
        expected: {
            value: "0.6",
            modifier: "n",
        },
    },
];

describe("SiUnitsFormatterComponent", () => {
    let component: SiUnitsFormatterComponent;
    let fixture: ComponentFixture<SiUnitsFormatterComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiPizzagnaModule, NuiDashboardsModule],
            declarations: [SiUnitsFormatterComponent],
            providers: [PizzagnaService],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SiUnitsFormatterComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe("value formatting > ", () => {
        TEST_DATA.forEach((test) => {
            it("should correctly format Si units", () => {
                const data = new SimpleChange(undefined, test.input, false);

                component.ngOnChanges({ data });
                expect(component.value).toEqual(test.expected.value);
                expect(component.modifier).toEqual(test.expected.modifier);
            });
        });
    });
});
