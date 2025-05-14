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

import { Component, Input, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChartDonutContentComponent } from "./chart-donut-content.component";
import { ChartDonutContentPlugin } from "../core/plugins/chart-donut-content-plugin";

// since Angular doesn't fire ngOnChanges while creating component directly, we have to use wrapper component
@Component({
    selector: "nui-chart-content-wrapper",
    template: `<nui-chart-donut-content
        [plugin]="plugin"
    ></nui-chart-donut-content>`,
    standalone: false,
})
class ChartContentWrapperComponent {
    @Input() plugin: ChartDonutContentPlugin;
    @ViewChild(ChartDonutContentComponent)
    donutContent: ChartDonutContentComponent;
}

describe("components >", () => {
    describe("chart-donut-content >", () => {
        let fixture: ComponentFixture<ChartContentWrapperComponent>;
        let component: ChartContentWrapperComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ChartContentWrapperComponent,
                    ChartDonutContentComponent,
                ],
            });

            fixture = TestBed.createComponent(ChartContentWrapperComponent);
            component = fixture.componentInstance;

            component.plugin = new ChartDonutContentPlugin();
            component.plugin.chart = <any>{ updateDimensions: () => {} };

            fixture.detectChanges();
        });

        describe("contentPosition >", () => {
            it("should be updated on plugin content position update", () => {
                const expectedContentPosition = {
                    top: 1,
                    left: 1,
                    width: 1,
                    height: 1,
                };
                expect(component.donutContent.contentPosition).toBeUndefined();
                component.plugin.contentPositionUpdateSubject.next(
                    expectedContentPosition
                );
                expect(component.donutContent.contentPosition).toEqual(
                    expectedContentPosition
                );
            });
        });
    });
});
