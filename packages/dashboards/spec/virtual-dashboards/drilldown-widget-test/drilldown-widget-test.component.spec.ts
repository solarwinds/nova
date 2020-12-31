import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NuiButtonModule, NuiDocsModule, NuiMessageModule, NuiSwitchModule } from "@solarwinds/nova-bits";
import { NuiDashboardsModule } from "@solarwinds/nova-dashboards";

import { DrilldownWidgetTestComponent } from "./drilldown-widget-test.component";


describe("Drilldown", () => {
    let component: DrilldownWidgetTestComponent;
    let fixture: ComponentFixture<DrilldownWidgetTestComponent>;

    beforeEach(async(() => {
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
            const listWidget = (component as any).drilldownRegistry.componentMap.listWidget;

            await fixture.whenStable();
            fixture.detectChanges();

            expect(listWidget.data).toBeTruthy();
        });

        it("should drilldown", async () => {
            const listWidget = (component as any).drilldownRegistry.componentMap.listWidget;
            const adapter = (component as any).drilldownRegistry.providersMap.listWidget.adapter;

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
            const listWidget = (component as any).drilldownRegistry.componentMap.listWidget;
            const navigationBar = (component as any).drilldownRegistry.componentMap.navigationBar;
            const adapter = (component as any).drilldownRegistry.providersMap.listWidget.adapter;

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
            const listWidget = (component as any).drilldownRegistry.componentMap.listWidget;
            const navigationBar = (component as any).drilldownRegistry.componentMap.navigationBar;
            const adapter = (component as any).drilldownRegistry.providersMap.listWidget.adapter;

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
            const navigationBar = (component as any).drilldownRegistry.componentMap.navigationBar;
            const adapter = (component as any).drilldownRegistry.providersMap.listWidget.adapter;

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(0);
            expect(navigationBar.navBarConfig.isRoot).toBe(true);
            expect(fixture.nativeElement.querySelector("nui-navigation-bar .list-nav-bar")).toBeFalsy();
        });

        it("should be visible after drilldown", async () => {
            const listWidget = (component as any).drilldownRegistry.componentMap.listWidget;
            const navigationBar = (component as any).drilldownRegistry.componentMap.navigationBar;
            const adapter = (component as any).drilldownRegistry.providersMap.listWidget.adapter;

            await fixture.whenStable();
            fixture.detectChanges();

            listWidget.onListItemEvent(listWidget.data[0]);

            await fixture.whenStable();
            fixture.detectChanges();

            expect(adapter.drillstate.length).toBe(1);
            expect(navigationBar.navBarConfig.isRoot).toBe(false);
            expect(fixture.nativeElement.querySelector("nui-navigation-bar .list-nav-bar")).toBeTruthy();
        });
    });
});
