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

import { SheetComponent } from "./sheet.component";

describe("sheet", () => {
    let fixture: ComponentFixture<SheetComponent>;
    let sheetComponent: SheetComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SheetComponent],
        });
        fixture = TestBed.createComponent(SheetComponent);
        sheetComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should apply 'row' direction correctly", () => {
        sheetComponent.direction = "row";
        sheetComponent.ngOnInit();
        expect(sheetComponent.directionRow).toBe(true);
        expect(sheetComponent.directionColumn).toBe(false);
    });
    it("should apply 'column' direction correctly", () => {
        sheetComponent.direction = "column";
        sheetComponent.ngOnInit();
        expect(sheetComponent.directionRow).toBe(false);
        expect(sheetComponent.directionColumn).toBe(true);
    });
});
