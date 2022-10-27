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

import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ChipsOverflowComponent } from "./chips-overflow.component";

describe("components >", () => {
    describe("ChipsOverflowComponent", () => {
        let component: ChipsOverflowComponent;
        let fixture: ComponentFixture<ChipsOverflowComponent>;

        beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ChipsOverflowComponent],
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChipsOverflowComponent);
            component = fixture.componentInstance;
            component.itemsSource = {};
            fixture.detectChanges();
        });

        it("should create component", () => {
            expect(component).toBeTruthy();
        });

        it("should emit data on clear", () => {
            const chipRemovedEmitSpy = spyOn(component.chipRemoved, "emit");

            const items = [
                { id: "statusGroupItem1", label: "Down" },
                { id: "statusGroupItem2", label: "Critical" },
                { id: "statusGroupItem3", label: "Warning" },
                { id: "statusGroupItem4", label: "Unknown" },
                { id: "statusGroupItem5", label: "Ok" },
            ];

            component.itemsSource.groupedItems = [
                {
                    id: "statusGroupId",
                    items: items,
                    label: "Status",
                },
            ];

            const data = {
                item: {
                    id: "statusGroupItem1",
                    label: "Down",
                },
                group: {
                    id: "statusGroupId",
                    label: "Status",
                    items: items,
                },
            };

            component.onClear(data);
            expect(chipRemovedEmitSpy).toHaveBeenCalledWith(data);
        });
    });
});
