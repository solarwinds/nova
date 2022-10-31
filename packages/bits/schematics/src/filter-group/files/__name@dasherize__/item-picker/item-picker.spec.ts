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

import { DatePipe } from "@angular/common";
import { Xliff } from "@angular/compiler";
import { TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ISelection, NuiCommonModule, NuiRepeatModule, NuiSorterModule } from "@nova-ui/bits";

import { IFilterGroupOption } from "../public-api";

import { ItemPickerComponent } from "./item-picker.component";

const ITEM_PICKER_OPTIONS: IFilterGroupOption[] = [
    {
        value: "azure",
        displayValue: "Azure",
    }, {
        value: "black",
        displayValue: "Black",
    }, {
        value: "blue",
        displayValue: "Blue",
    }, {
        value: "yellow",
        displayValue: "Yellow",
    },
];

const SELECTION: ISelection = {
    isAllPages: false,
    include: [],
    exclude: [],
};

describe("components >", () => {
    describe("item-picker >", () => {
        let fixture: ComponentFixture<ItemPickerComponent>;
        let component: ItemPickerComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    NuiCommonModule,
                    NuiSorterModule,
                    NuiRepeatModule,
                ],
                declarations: [
                    ItemPickerComponent,
                ],
                providers: [
                    { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
                    { provide: TRANSLATIONS, useValue: Xliff },
                    DatePipe,
                ],
            });

            fixture = TestBed.createComponent(ItemPickerComponent);
            component = fixture.componentInstance;
            component.itemPickerOptions = ITEM_PICKER_OPTIONS;
            component.selection = SELECTION;
        });

        it("should emit correct selection", () => {
            spyOn(component.selectionChanged, "emit").and.callThrough();
            const newSelection: ISelection = {
                isAllPages: false,
                include: [ITEM_PICKER_OPTIONS[0]],
                exclude: [],
            };
            component.onSelection(newSelection);
            expect(component.selectionChanged.emit).toHaveBeenCalledWith(newSelection);
        });

        it("getSelectedOptions should return correct values", () => {
            component.selectedValues = ["azure"];
            expect(component.getSelectedOptions()).toEqual([ITEM_PICKER_OPTIONS[0]]);
        });
    });
});
