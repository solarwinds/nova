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

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SheetGroupComponent } from "./sheet-group.component";

describe("sheet-group", () => {
    let fixture: ComponentFixture<SheetGroupComponent>;
    let sheetGroupComponent: SheetGroupComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SheetGroupComponent],
        });
        fixture = TestBed.createComponent(SheetGroupComponent);
        sheetGroupComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should apply 'row' direction correctly", () => {
        sheetGroupComponent.direction = "row";
        sheetGroupComponent.ngOnInit();
        expect(sheetGroupComponent.applyDirectionRowClass).toBe(true);
        expect(sheetGroupComponent.applyDirectionColumnClass).toBe(false);
    });
    it("should apply 'column' direction correctly", () => {
        sheetGroupComponent.direction = "column";
        sheetGroupComponent.ngOnInit();
        expect(sheetGroupComponent.applyDirectionRowClass).toBe(false);
        expect(sheetGroupComponent.applyDirectionColumnClass).toBe(true);
    });
    it("should apply joined sheetsType correctly", () => {
        sheetGroupComponent.sheetsType = "joined";
        sheetGroupComponent.ngOnInit();
        expect(sheetGroupComponent.applyJoinedSheetsClass).toBe(true);
    });
    it("should apply separate sheetsType correctly", () => {
        sheetGroupComponent.sheetsType = "separate";
        sheetGroupComponent.ngOnInit();
        expect(sheetGroupComponent.applySeparateSheetsClass).toBe(true);
    });
});
