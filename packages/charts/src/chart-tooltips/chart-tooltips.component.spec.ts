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
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
} from "@angular/core/testing";

import { NuiPopoverModule } from "@nova-ui/bits";

import { ChartTooltipsPlugin } from "../core/plugins/tooltips";
import { ChartTooltipComponent } from "./chart-tooltip.component";
import { ChartTooltipDirective } from "./chart-tooltip.directive";
import { ChartTooltipsComponent } from "./chart-tooltips.component";

describe("ChartTooltipsComponent", () => {
    let component: ChartTooltipsComponent;
    let fixture: ComponentFixture<ChartTooltipsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                ChartTooltipsComponent,
                ChartTooltipDirective,
                ChartTooltipComponent,
            ],
            imports: [NuiPopoverModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartTooltipsComponent);
        component = fixture.componentInstance;
        component.plugin = new ChartTooltipsPlugin();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("hideSubject observer", () => {
        it("should emit the closeTooltips subject after a timeout", fakeAsync(() => {
            component.ngOnChanges({
                plugin: new SimpleChange(null, component.plugin, true),
            });
            spyOn(component.closeTooltips, "next");
            component.plugin.hideSubject.next();

            expect(component.closeTooltips.next).not.toHaveBeenCalled();
            flush();
            expect(component.closeTooltips.next).toHaveBeenCalled();
        }));
    });
});
