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
import { ISelection, NuiActiveDialog, NuiButtonModule, NuiDialogModule, NuiSelectorModule, SelectorService  } from "@nova-ui/bits";

import { ItemPickerModule } from "../item-picker/item-picker.module";
import { IFilterGroupOption } from "../public-api";

import { FilterGroupDialogComponent } from "./filter-group-dialog.component";

const ITEMS: IFilterGroupOption[] = [
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

const SELECTED_ITEMS = ["yellow"];

describe("components >", () => {
    describe("filter-group-dialog >", () => {
        let fixture: ComponentFixture<FilterGroupDialogComponent>;
        let component: FilterGroupDialogComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    NuiDialogModule,
                    NuiButtonModule,
                    NuiSelectorModule,
                    ItemPickerModule,
                ],
                declarations: [
                    FilterGroupDialogComponent,
                ],
                providers: [
                    NuiActiveDialog,
                    SelectorService,
                    DatePipe,
                    { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
                    { provide: TRANSLATIONS, useValue: Xliff },
                ],
            });

            fixture = TestBed.createComponent(FilterGroupDialogComponent);
            component = fixture.componentInstance;
            component.itemPickerOptions = ITEMS;
            component.selectedValues = SELECTED_ITEMS;
            component.title = "Test title";
        });

        it("Should apply correct selectedValues when something selected in item picker", () => {
            const SELECTION: ISelection = {
                isAllPages: false,
                include: [ITEMS[0]],
                exclude: [],
            };
            component.onSelectionChanged(SELECTION);
            expect(component.selectedValues).toEqual(["azure"]);
        });

        it("Should emit correct values on dialog 'Save' button click", () => {
            spyOn(component.dialogClosed, "emit").and.callThrough();
            fixture.componentInstance.acceptDialogFilters();
            expect(component.dialogClosed.emit).toHaveBeenCalledWith(SELECTED_ITEMS);
        });

        it("Should not emit anything on dialog 'Close' button click", () => {
            spyOn(component.dialogClosed, "emit").and.callThrough();
            fixture.componentInstance.closeDialog();
            expect(component.dialogClosed.emit).not.toHaveBeenCalled();
        });
    });
});
