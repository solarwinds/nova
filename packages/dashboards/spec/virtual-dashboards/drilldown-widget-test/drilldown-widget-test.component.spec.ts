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

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {
    NuiButtonModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiSwitchModule,
} from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { DrilldownWidgetTestComponent } from "./drilldown-widget-test.component";

describe("Drilldown", () => {
    let component: DrilldownWidgetTestComponent;
    let fixture: ComponentFixture<DrilldownWidgetTestComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NuiDashboardsModule,
                NuiButtonModule,
                NuiDocsModule,
                NuiMessageModule,
                NuiSwitchModule,
                HttpClientTestingModule,
            ],
            declarations: [DrilldownWidgetTestComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrilldownWidgetTestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("general > ", () => {
        it("should set data", async () => {
            const listWidget = (component as any).drilldownRegistry.componentMap
                .listWidget;

            await fixture.whenStable();
            fixture.detectChanges();

            expect(listWidget.data).toBeTruthy();
        });

        it("should drilldown", async () => {
            const listWidget = (component as any).drilldownRegistry.componentMap
                .listWidget;
            const adapter = (component as any).drilldownRegistry.providersMap
                .listWidget.adapter;

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(0);

            listWidget.onListItemEvent(listWidget.data[0]);

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(1);
        });
    });

    describe("navigation bar > ", () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it("should navigate back", async () => {
            const listWidget = (component as any).drilldownRegistry.componentMap
                .listWidget;
            const navigationBar = (component as any).drilldownRegistry
                .componentMap.navigationBar;
            const adapter = (component as any).drilldownRegistry.providersMap
                .listWidget.adapter;

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(0);

            listWidget.onListItemEvent(listWidget.data[0]);

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(1);

            navigationBar.onBack();

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(0);
        });

        it("should navigate home", async () => {
            const listWidget = (component as any).drilldownRegistry.componentMap
                .listWidget;
            const navigationBar = (component as any).drilldownRegistry
                .componentMap.navigationBar;
            const adapter = (component as any).drilldownRegistry.providersMap
                .listWidget.adapter;

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(0);

            listWidget.onListItemEvent(listWidget.data[0]);

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(1);

            navigationBar.onHome();

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(0);
        });

        it("should be hidden on home page", async () => {
            const navigationBar = (component as any).drilldownRegistry
                .componentMap.navigationBar;
            const adapter = (component as any).drilldownRegistry.providersMap
                .listWidget.adapter;

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(0);
            expect(navigationBar.navBarConfig.isRoot).toBe(true);
            expect(
                fixture.nativeElement.querySelector(
                    "nui-navigation-bar .list-nav-bar"
                )
            ).toBeFalsy();
        });

        it("should be visible after drilldown", async () => {
            const listWidget = (component as any).drilldownRegistry.componentMap
                .listWidget;
            const navigationBar = (component as any).drilldownRegistry
                .componentMap.navigationBar;
            const adapter = (component as any).drilldownRegistry.providersMap
                .listWidget.adapter;

            await fixture.whenStable();
            fixture.detectChanges();

            listWidget.onListItemEvent(listWidget.data[0]);

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(1);
            expect(navigationBar.navBarConfig.isRoot).toBe(false);
            expect(
                fixture.nativeElement.querySelector(
                    "nui-navigation-bar .list-nav-bar"
                )
            ).toBeTruthy();
        });
    });
});
