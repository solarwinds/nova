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

import { Component, TemplateRef, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UnitConversionService } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { IProportionalDataItem } from "../types";
import { NuiDashboardViewsModule } from "../views.module";
import { ProportionalChartViewComponent } from "./proportional-chart-view.component";

@Component({
    template: `
        <nui-proportional-chart-view
            [data]="data"
            [chartType]="chartType"
            [legendPlacement]="legendPlacement"
            [colors]="colors"
            [interactive]="interactive"
            [donutContentTemplate]="donutTpl"
            [legendItemTemplate]="legendTpl"
            (itemClick)="onItemClick($event)"
        ></nui-proportional-chart-view>

        <ng-template #donutTpl let-data let-chartAssist="chartAssist">
            <span class="custom-donut-content">Custom Content</span>
        </ng-template>

        <ng-template #legendTpl let-item let-series="series">
            <span class="custom-legend-item">{{ item?.name }}</span>
        </ng-template>
    `,
    standalone: false,
})
class TestHostComponent {
    data: Array<IProportionalDataItem> = [];
    chartType: "donut" | "pie" | "verticalBar" | "horizontalBar" = "donut";
    legendPlacement: "right" | "bottom" | "none" = "right";
    colors: Array<string> | Record<string, string> = [];
    interactive = false;
    clickedItem: IProportionalDataItem | null = null;

    @ViewChild("donutTpl") donutTpl: TemplateRef<any>;
    @ViewChild("legendTpl") legendTpl: TemplateRef<any>;

    onItemClick(item: IProportionalDataItem): void {
        this.clickedItem = item;
    }
}

describe("ProportionalChartViewComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let component: ProportionalChartViewComponent;

    const mockData: Array<IProportionalDataItem> = [
        { id: "segment-1", name: "Segment One", value: 30, color: "#ff0000" },
        { id: "segment-2", name: "Segment Two", value: 50, color: "#00ff00" },
        { id: "segment-3", name: "Segment Three", value: 20, color: "#0000ff" },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NuiDashboardViewsModule, NuiChartsModule],
            declarations: [TestHostComponent],
            providers: [UnitConversionService],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        component = fixture.debugElement.children[0].componentInstance;
    });

    it("should create without Pizzagna providers", () => {
        expect(component).toBeTruthy();
    });

    it("should display empty state when data is empty", () => {
        host.data = [];
        fixture.detectChanges();
        expect(component.isEmpty).toBe(true);
    });

    it("should build a donut chart by default", () => {
        host.data = mockData;
        fixture.detectChanges();

        expect(component.chartAssist).toBeTruthy();
        expect(component.isDonutChart()).toBe(true);
        expect(component.donutContentPlugin).toBeTruthy();
    });

    it("should build a pie chart when chartType is 'pie'", () => {
        host.data = mockData;
        host.chartType = "pie";
        fixture.detectChanges();

        expect(component.chartAssist).toBeTruthy();
        expect(component.isDonutChart()).toBe(false);
        expect(component.donutContentPlugin).toBeNull();
    });

    it("should build a vertical bar chart", () => {
        host.data = mockData;
        host.chartType = "verticalBar";
        fixture.detectChanges();

        expect(component.chartAssist).toBeTruthy();
        expect(component.donutContentPlugin).toBeNull();
    });

    it("should build a horizontal bar chart", () => {
        host.data = mockData;
        host.chartType = "horizontalBar";
        fixture.detectChanges();

        expect(component.chartAssist).toBeTruthy();
        expect(component.donutContentPlugin).toBeNull();
    });

    it("should show legend when legendPlacement is 'right'", () => {
        host.data = mockData;
        host.legendPlacement = "right";
        fixture.detectChanges();

        expect(component.hasLegend()).toBe(true);
        expect(component.legendShouldBeAlignedRight()).toBe(true);
    });

    it("should show legend when legendPlacement is 'bottom'", () => {
        host.data = mockData;
        host.legendPlacement = "bottom";
        fixture.detectChanges();

        expect(component.hasLegend()).toBe(true);
        expect(component.legendShouldBeAlignedRight()).toBe(false);
    });

    it("should hide legend when legendPlacement is 'none'", () => {
        host.data = mockData;
        host.legendPlacement = "none";
        fixture.detectChanges();

        expect(component.hasLegend()).toBe(false);
    });

    it("should not emit itemClick when not interactive", () => {
        host.data = mockData;
        host.interactive = false;
        fixture.detectChanges();

        component.onInteraction({ id: "segment-1" });
        expect(host.clickedItem).toBeNull();
    });

    it("should emit itemClick when interactive", () => {
        host.data = mockData;
        host.interactive = true;
        fixture.detectChanges();

        component.onInteraction({ id: "segment-1" });
        expect<IProportionalDataItem | null>(host.clickedItem).toEqual(
            mockData[0]
        );
    });

    it("keeps the legend list structure while making its items focusable", () => {
        host.data = mockData;
        fixture.detectChanges();

        const legend = fixture.nativeElement.querySelector("nui-legend");
        const items = legend.querySelectorAll("nui-legend-series");

        expect(legend.getAttribute("role")).toBe("list");
        expect(items.length).toBe(mockData.length);
        items.forEach((item: HTMLElement) => {
            expect(item.getAttribute("role")).toBe("listitem");
            expect(item.getAttribute("tabindex")).toBe("0");
        });
    });

    it("exposes a separate native action button without toggling visibility", () => {
        host.data = mockData;
        host.interactive = true;
        fixture.detectChanges();
        const item = fixture.nativeElement.querySelector("nui-legend-series");
        const componentInstance = component;

        const action: HTMLButtonElement = item.querySelector(
            ".proportional-chart__legend-action"
        );
        expect(item.getAttribute("role")).toBe("listitem");
        expect(item.hasAttribute("tabindex")).toBe(false);
        expect(action.type).toBe("button");
        expect(action.getAttribute("aria-label")).toContain("Segment One");
        spyOn(componentInstance, "onInteraction").and.callThrough();
        action.click();
        expect(componentInstance.onInteraction).toHaveBeenCalledTimes(1);
        expect<IProportionalDataItem | null>(host.clickedItem).toEqual(
            mockData[0]
        );

        expect(component.chartAssist.isSeriesHidden("segment-1")).toBe(false);
    });

    it("does not activate a non-interactive legend item from the keyboard", () => {
        host.data = mockData;
        fixture.detectChanges();
        const item = fixture.nativeElement.querySelector("nui-legend-series");
        spyOn(component, "onInteraction");

        item.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Enter",
                bubbles: true,
                cancelable: true,
                code: "Enter",
            })
        );
        item.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: " ",
                bubbles: true,
                cancelable: true,
                code: "Space",
            })
        );

        expect(component.onInteraction).not.toHaveBeenCalled();
        expect(component.chartAssist.isSeriesHidden("segment-1")).toBe(false);
    });

    it("uses keyboard focus for emphasis without changing mouse leave behavior", () => {
        host.data = mockData;
        fixture.detectChanges();
        const emphasizeSeriesSpy = spyOn(
            component.chartAssist,
            "emphasizeSeries"
        );
        const resetVisibleSeriesSpy = spyOn(
            component.chartAssist,
            "resetVisibleSeries"
        );

        component.onLegendSeriesMouseEnter({ id: "segment-3" });
        component.onLegendMouseLeave();
        expect(resetVisibleSeriesSpy).toHaveBeenCalledTimes(1);
        resetVisibleSeriesSpy.calls.reset();
        emphasizeSeriesSpy.calls.reset();

        const focusedTarget = document.createElement("span");
        const matchesFocusVisible = spyOn(focusedTarget, "matches");
        const focusEvent = new FocusEvent("focusin");
        Object.defineProperty(focusEvent, "target", { value: focusedTarget });
        Object.defineProperty(focusEvent, "currentTarget", {
            value: focusedTarget,
        });
        matchesFocusVisible.and.returnValue(false);
        component.onLegendSeriesFocus({ id: "segment-1" }, focusEvent);
        expect(emphasizeSeriesSpy).not.toHaveBeenCalled();

        matchesFocusVisible.and.returnValue(true);
        component.onLegendSeriesFocus({ id: "segment-1" }, focusEvent);
        expect(emphasizeSeriesSpy).toHaveBeenCalledWith("segment-1");

        component.onLegendSeriesMouseEnter({ id: "segment-2" });
        component.onLegendMouseLeave();
        expect(emphasizeSeriesSpy).toHaveBeenCalledWith("segment-1");
        expect(resetVisibleSeriesSpy).not.toHaveBeenCalled();

        component.onLegendFocusOut();
        expect(resetVisibleSeriesSpy).toHaveBeenCalled();
    });

    it("should apply colors from data", () => {
        host.data = mockData;
        fixture.detectChanges();

        // Chart should be built with data-driven colors
        expect(component.chartAssist).toBeTruthy();
    });

    it("clears keyboard emphasis when its item is removed", () => {
        host.data = mockData;
        fixture.detectChanges();
        const target = document.createElement("span");
        spyOn(target, "matches").and.returnValue(true);
        const focus = new FocusEvent("focusin");
        Object.defineProperty(focus, "target", { value: target });
        Object.defineProperty(focus, "currentTarget", { value: target });
        component.onLegendSeriesFocus({ id: "segment-1" }, focus);

        const reset = spyOn(component.chartAssist, "resetVisibleSeries");
        host.data = mockData.slice(1);
        fixture.detectChanges();
        expect(component.data).withContext("updated input").toEqual(host.data);
        expect(reset)
            .withContext("removed focused item")
            .toHaveBeenCalledTimes(1);
        const emphasize = spyOn(component.chartAssist, "emphasizeSeries");
        component.onLegendMouseLeave();
        expect(emphasize).not.toHaveBeenCalled();
    });

    it("clears keyboard emphasis when the legend is hidden", () => {
        host.data = mockData;
        fixture.detectChanges();
        const target = document.createElement("span");
        spyOn(target, "matches").and.returnValue(true);
        const focus = new FocusEvent("focusin");
        Object.defineProperty(focus, "target", { value: target });
        Object.defineProperty(focus, "currentTarget", { value: target });
        component.onLegendSeriesFocus({ id: "segment-1" }, focus);

        const reset = spyOn(component.chartAssist, "resetVisibleSeries");
        host.legendPlacement = "none";
        fixture.detectChanges();
        expect(reset).toHaveBeenCalledTimes(1);
        reset.calls.reset();
        component.onLegendMouseLeave();
        expect(reset).toHaveBeenCalledTimes(1);
    });

    it("does not change mouse-only emphasis when the legend placement changes", () => {
        host.data = mockData;
        fixture.detectChanges();
        component.onLegendSeriesMouseEnter({ id: "segment-1" });
        const reset = spyOn(component.chartAssist, "resetVisibleSeries");
        host.legendPlacement = "none";
        fixture.detectChanges();
        expect(reset).not.toHaveBeenCalled();
    });

    it("should apply configuration colors when provided", () => {
        host.data = [
            { id: "a", name: "A", value: 10 },
            { id: "b", name: "B", value: 20 },
        ];
        host.colors = ["#aaa", "#bbb"];
        fixture.detectChanges();

        expect(component.chartAssist).toBeTruthy();
    });

    it("should apply mapped colors when provided as record", () => {
        host.data = [
            { id: "a", name: "A", value: 10 },
            { id: "b", name: "B", value: 20 },
        ];
        host.colors = { a: "#aaa", b: "#bbb" };
        fixture.detectChanges();

        expect(component.chartAssist).toBeTruthy();
    });

    it("should update chart when data changes", () => {
        host.data = mockData;
        fixture.detectChanges();

        const chartAssist1 = component.chartAssist;

        host.data = [{ id: "x", name: "X", value: 100, color: "#fff" }];
        fixture.detectChanges();

        // Chart assist may be rebuilt due to color changes
        expect(component.chartAssist).toBeTruthy();
    });

    it("should clean up on destroy", () => {
        host.data = mockData;
        fixture.detectChanges();

        expect(() => fixture.destroy()).not.toThrow();
    });
});
