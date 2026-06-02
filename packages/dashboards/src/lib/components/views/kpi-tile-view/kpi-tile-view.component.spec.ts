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
import { BehaviorSubject } from "rxjs";

import { NuiDashboardViewsModule } from "../views.module";
import { IKpiTileViewBroker, KpiTileViewComponent } from "./kpi-tile-view.component";

@Component({
    template: `
        <nui-kpi-tile-view
            [value]="value"
            [label]="label"
            [units]="units"
            [backgroundColor]="backgroundColor"
            [textColor]="textColor"
            [link]="link"
            [interactive]="interactive"
            [loading]="loading"
            [empty]="empty"
            [fontSize]="fontSize"
            [syncValuesBroker]="syncValuesBroker"
            [valueTemplate]="customValueTpl"
            (tileClick)="onTileClick()"
        ></nui-kpi-tile-view>

        <ng-template #customValueTpl let-val>
            <span class="custom-value">{{ val }} custom</span>
        </ng-template>
    `,
    standalone: false,
})
class TestHostComponent {
    value: string | number | null = null;
    label = "";
    units = "";
    backgroundColor = "";
    textColor = "";
    link = "";
    interactive = false;
    loading = false;
    empty = false;
    fontSize = "";
    syncValuesBroker: Array<IKpiTileViewBroker> = [];
    customValueTpl: TemplateRef<any> | null = null;
    clicked = false;

    @ViewChild("customValueTpl") customValueTplRef: TemplateRef<any>;

    onTileClick(): void {
        this.clicked = true;
    }
}

describe("KpiTileViewComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let component: KpiTileViewComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NuiDashboardViewsModule],
            declarations: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        component = fixture.debugElement.children[0].componentInstance;
    });

    it("should create without Pizzagna providers", () => {
        expect(component).toBeTruthy();
    });

    it("should render value and label", () => {
        host.value = 42;
        host.label = "Nodes Up";
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain("42");
        expect(el.textContent).toContain("Nodes Up");
    });

    it("should render units", () => {
        host.value = 99;
        host.units = "%";
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain("%");
    });

    it("should apply background color", () => {
        host.value = 10;
        host.backgroundColor = "#2cc079";
        fixture.detectChanges();

        const bg = fixture.nativeElement.querySelector(".nui-kpi-indicator__background");
        expect(bg.style.backgroundColor).toBeTruthy();
    });

    it("should show empty state when empty is true", () => {
        host.empty = true;
        fixture.detectChanges();

        expect(component.showEmpty).toBe(true);
    });

    it("should show empty state when value is null", () => {
        host.value = null;
        fixture.detectChanges();

        expect(component.showEmpty).toBe(true);
    });

    it("should not show empty state when value is 0", () => {
        host.value = 0;
        fixture.detectChanges();

        expect(component.showEmpty).toBe(false);
    });

    it("should not show empty state when value is boolean", () => {
        host.value = false as any;
        fixture.detectChanges();

        expect(component.showEmpty).toBe(false);
    });

    it("should emit tileClick when interactive and clicked", () => {
        host.value = 42;
        host.interactive = true;
        fixture.detectChanges();

        component.onInteraction();
        expect(host.clicked).toBe(true);
    });

    it("should not emit tileClick when not interactive", () => {
        host.value = 42;
        host.interactive = false;
        fixture.detectChanges();

        component.onInteraction();
        expect(host.clicked).toBe(false);
    });

    it("should not be interactive when showEmpty is true", () => {
        host.value = null;
        host.interactive = true;
        fixture.detectChanges();

        expect(component.isInteractive).toBe(false);
    });

    it("should render link as anchor element", () => {
        host.value = 42;
        host.label = "Test";
        host.link = "https://example.com";
        fixture.detectChanges();

        const anchor = fixture.nativeElement.querySelector("a.nui-kpi-indicator");
        expect(anchor).toBeTruthy();
        expect(anchor.href).toContain("example.com");
    });

    it("should render div when no link", () => {
        host.value = 42;
        host.label = "Test";
        host.link = "";
        fixture.detectChanges();

        const div = fixture.nativeElement.querySelector("div.nui-kpi-indicator");
        expect(div).toBeTruthy();
    });

    it("should compute text color from background when no explicit textColor", () => {
        host.value = 42;
        host.backgroundColor = "#ff0000";
        host.textColor = "";
        fixture.detectChanges();

        expect(component.computedTextColor).toBe("#ff0000");
    });

    it("should use explicit textColor when provided", () => {
        host.value = 42;
        host.backgroundColor = "#ff0000";
        host.textColor = "#ffffff";
        fixture.detectChanges();

        expect(component.computedTextColor).toBe("#ffffff");
    });

    it("should use default color when no background or text color", () => {
        host.value = 42;
        fixture.detectChanges();

        expect(component.computedTextColor).toBe("var(--nui-color-bg-secondary)");
    });

    it("should render custom value template when provided", () => {
        host.value = 42;
        fixture.detectChanges();

        // Set the custom template
        host.customValueTpl = host.customValueTplRef;
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector(".custom-value")).toBeTruthy();
    });

    it("should return correct scale broker", () => {
        const mockBroker: IKpiTileViewBroker = {
            id: "value",
            in$: new BehaviorSubject<any>({ id: "value", targetID: "", targetValue: 0 }),
            out$: new BehaviorSubject<any>({ id: "value", targetID: "", targetValue: 0 }),
        };
        host.syncValuesBroker = [mockBroker];
        fixture.detectChanges();

        expect(component.getScaleBroker("value")).toBe(mockBroker);
        expect(component.getScaleBroker("nonexistent")).toBeUndefined();
    });

    it("should show loading state", () => {
        host.loading = true;
        fixture.detectChanges();

        const busyEl = fixture.nativeElement.querySelector("[nui-busy]");
        expect(busyEl).toBeTruthy();
    });
});
