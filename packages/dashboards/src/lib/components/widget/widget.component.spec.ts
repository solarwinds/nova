import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { NuiDashboardsModule } from "../../dashboards.module";
import { ProviderRegistryService } from "../../services/provider-registry.service";
import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { StackComponent } from "../layouts/stack/stack.component";
import { WidgetComponent } from "./widget.component";

describe("WidgetComponent", () => {
    let component: WidgetComponent;
    let fixture: ComponentFixture<WidgetComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [ProviderRegistryService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetComponent);
        component = fixture.componentInstance;
        component.widget = {
            id: "id",
            type: "kpi",
            pizzagna: {
                structure: {
                    [DEFAULT_PIZZAGNA_ROOT]: {
                        componentType: StackComponent.lateLoadKey,
                    },
                },
            },
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        it("should not invoke widgetConfigurationService.updateWidget if the widget input hasn't changed", () => {
            spyOn((<any>component).widgetConfigurationService, "updateWidget");
            component.ngOnChanges({
                test: new SimpleChange(null, null, false),
            });
            expect(
                (<any>component).widgetConfigurationService.updateWidget
            ).not.toHaveBeenCalled();
        });

        it("should invoke widgetConfigurationService.updateWidget if the widget input changes", () => {
            spyOn((<any>component).widgetConfigurationService, "updateWidget");
            component.ngOnChanges({
                widget: new SimpleChange(null, null, false),
            });
            expect(
                (<any>component).widgetConfigurationService.updateWidget
            ).toHaveBeenCalledWith(component.widget);
        });
    });

    describe("onPizzagnaChange > ", () => {
        it("should emit widgetChange output", () => {
            const pizzagna = { test: {} };
            spyOn(component.widgetChange, "emit");
            component.onPizzagnaChange(pizzagna);
            expect(component.widgetChange.emit).toHaveBeenCalledWith({
                ...component.widget,
                pizzagna,
            });
        });
    });
});
