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

import { CardGroupComponent } from "./card-group.component";

describe("card-group", () => {
    let fixture: ComponentFixture<CardGroupComponent>;
    let cardGroupComponent: CardGroupComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CardGroupComponent],
        });
        fixture = TestBed.createComponent(CardGroupComponent);
        cardGroupComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should apply 'row' direction correctly", () => {
        cardGroupComponent.direction = "row";
        cardGroupComponent.ngOnInit();
        expect(cardGroupComponent.directionRow).toBe(true);
        expect(cardGroupComponent.directionColumn).toBe(false);
    });
    it("should apply 'column' direction correctly", () => {
        cardGroupComponent.direction = "column";
        cardGroupComponent.ngOnInit();
        expect(cardGroupComponent.directionRow).toBe(false);
        expect(cardGroupComponent.directionColumn).toBe(true);
    });
});
