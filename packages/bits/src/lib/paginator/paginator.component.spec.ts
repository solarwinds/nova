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

import { OverlayModule } from "@angular/cdk/overlay";
import { ChangeDetectorRef, SimpleChange, SimpleChanges } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import noop from "lodash/noop";

import { PaginatorComponent } from "./paginator.component";
import { LoggerService } from "../../services/log-service";

describe("components >", () => {
    describe("paginator >", () => {
        let subject: PaginatorComponent;
        let fixture: ComponentFixture<PaginatorComponent>;
        const total = 1000;
        const pageSize = 25;
        const page = 3;
        const pageSizeSet = [5, 15, 25, 50, 170];
        beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [OverlayModule],
                providers: [ChangeDetectorRef],
            });

            const logger = TestBed.inject(LoggerService);
            spyOnProperty(logger, "warn").and.returnValue(noop);

            fixture = TestBed.createComponent(PaginatorComponent);
            subject = fixture.componentInstance;
            subject.total = total;
            subject.pageSize = pageSize;
            subject.page = page;
            subject.ngOnInit();
        }));

        it("should select page number " + page, () => {
            subject.goToPage(3);
            expect(subject.page).toEqual(3);
        });

        it("should have pageSize equal to " + pageSize, () => {
            subject.setItemsPerPage({
                newValue: pageSize,
                oldValue: pageSize - 1,
            });
            expect(subject.pageSize).toEqual(pageSize);
        });

        it("should have first item on the page equal to 51", () => {
            expect(subject.getFirstItemOnPage()).toEqual(51);
        });

        it("should have last item on the page equal to 75", () => {
            expect(subject.getLastItemOnPage()).toEqual(75);
        });

        it("should have page count equal to 40", () => {
            expect(subject.getPageCount()).toEqual(40);
        });

        it("should have items count in paginator equal to 7", () => {
            expect(subject.adjacent).toEqual(1);
            const changes: SimpleChanges = {
                page: new SimpleChange(3, 1, true),
            };
            subject.ngOnChanges(changes);
            // "< 1 2 3 4 5 ... 40 >" - including arrows -> 9
            expect(subject.itemsList.length).toEqual(9);
        });

        it("should not override custom pageSizeSet", () => {
            subject.pageSizeSet = pageSizeSet;
            subject.ngOnInit();
            expect(subject.pageSizeSet).toEqual([5, 15, 25, 50, 170]);
        });

        it("should not add custom page size to default pageSizeSet", () => {
            expect(subject.pageSizeSet).toEqual([10, 25, 50, 100]);
            subject.pageSize = 35;
            subject.ngOnInit();
            expect(subject.pageSizeSet).toEqual([10, 25, 50, 100]);
        });

        it("should not add custom page size to custom pageSizeSet", () => {
            subject.pageSizeSet = pageSizeSet;
            subject.ngOnInit();
            expect(subject.pageSizeSet).toEqual([5, 15, 25, 50, 170]);

            subject.pageSize = 35;
            subject.ngOnInit();
            expect(subject.pageSizeSet).toEqual([5, 15, 25, 50, 170]);
        });
    });
});
