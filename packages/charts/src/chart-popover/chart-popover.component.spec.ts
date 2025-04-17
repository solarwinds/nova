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

import { SimpleChange, SimpleChanges } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NuiPopoverModule, PopoverComponent } from "@nova-ui/bits";

import { ChartPopoverComponent } from "./chart-popover.component";
import { ChartPopoverPlugin } from "../core/plugins/chart-popover-plugin";

describe("ChartPopoverComponent", () => {
    let component: ChartPopoverComponent;
    let fixture: ComponentFixture<ChartPopoverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChartPopoverComponent],
            imports: [NuiPopoverModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartPopoverComponent);
        component = fixture.componentInstance;
        component.plugin = new ChartPopoverPlugin();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("plugin.updatePositionSubject subscription", () => {
        it("should update the host element's position", () => {
            component.plugin.updatePositionSubject.next({
                top: 5,
                left: 5,
                height: 0,
                width: 0,
            });

            expect(component.element.nativeElement.style.top).toEqual("5px");
            expect(component.element.nativeElement.style.left).toEqual("5px");
        });

        it("should invoke popover.updatePosition and popover.resetSize", () => {
            component.popover = {
                updatePosition: () => {},
                resetSize: () => {},
            } as PopoverComponent;

            const updatePositionSpy = spyOn(
                component.popover,
                "updatePosition"
            );
            const resetSizeSpy = spyOn(component.popover, "resetSize");

            component.plugin.updatePositionSubject.next({
                top: 5,
                left: 5,
                height: 0,
                width: 0,
            });

            expect(updatePositionSpy).toHaveBeenCalled();
            expect(resetSizeSpy).toHaveBeenCalled();
        });

        it("should emit 'update'", () => {
            component.plugin.dataPoints = {
                "series-1": {
                    index: 1,
                    seriesId: "series-1",
                    // @ts-ignore: Disabled for testing purposes
                    dataSeries: null,
                    data: {},
                    position: {
                        x: 100,
                        y: 100,
                        height: 50,
                        width: 50,
                    },
                },
            };

            const spy = spyOn(component.update, "next");
            component.plugin.updatePositionSubject.next({
                top: 5,
                left: 5,
                height: 0,
                width: 0,
            });

            expect(spy).toHaveBeenCalledWith(component.plugin.dataPoints);
        });

        it("should be unsubscribed on component destruction", () => {
            component.popover = {
                updatePosition: () => {},
            } as PopoverComponent;

            component.ngOnDestroy();

            const spy = spyOn(component.popover, "updatePosition");
            component.plugin.updatePositionSubject.next({
                top: 5,
                left: 5,
                height: 0,
                width: 0,
            });

            expect(spy).not.toHaveBeenCalled();
        });

        it("should be unsubscribed when the plugin changes", () => {
            component.popover = {
                updatePosition: () => {},
            } as PopoverComponent;
            const oldPopoverPlugin = component.plugin;

            component.plugin = new ChartPopoverPlugin();
            component.ngOnChanges({
                plugin: { isFirstChange: () => false } as SimpleChange,
            } as SimpleChanges);

            const spy = spyOn(component.popover, "updatePosition");
            oldPopoverPlugin.updatePositionSubject.next({
                top: 5,
                left: 5,
                height: 0,
                width: 0,
            });

            expect(spy).not.toHaveBeenCalled();
        });
    });
});
