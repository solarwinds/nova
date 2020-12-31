import { PortalModule } from "@angular/cdk/portal";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { LoggerService } from "@nova-ui/bits";
import { GridsterModule } from "angular-gridster2";
import { Observable } from "rxjs";

import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { WidgetComponent } from "../../components/widget/widget.component";
import { ConfiguratorService } from "../../configurator/services/configurator.service";
import { IConfiguratorSource } from "../../configurator/services/types";
import { WidgetEditorService } from "../../configurator/services/widget-editor.service";
import { mockLoggerService } from "../../mocks";
import { PizzagnaComponent } from "../../pizzagna/components/pizzagna/pizzagna.component";
import { ComponentPortalDirective } from "../../pizzagna/directives/component-portal/component-portal.directive";
import { WIDGET_EDIT, WIDGET_REMOVE } from "../../services/types";
import { WidgetTypesService } from "../../services/widget-types.service";
import { IDashboard, IDashboardPersistenceHandler, IWidget } from "../../types";
import { kpi } from "../../widget-types/kpi/kpi";
import { GridsterItemWidgetIdDirective } from "../gridster-item-widget-id/gridster-item-widget-id.directive";

import { WidgetEditorDirective } from "./widget-editor.directive";

class MockSubmitHandler implements IDashboardPersistenceHandler {
    public trySubmit(widget: IWidget, source: IConfiguratorSource): Observable<IWidget> {
        // @ts-ignore: Suppressed for test purposes
        return null;
    }
}

@Component({
    template: `
        <nui-dashboard [nuiWidgetEditor]="submitHandler"
                          [(dashboard)]="dashboard"
                          [(gridsterConfig)]="gridsterConfig">
        </nui-dashboard>
    `,
    providers: [MockSubmitHandler],
})
class WidgetEditorDirectiveTestComponent {
    constructor(public submitHandler: MockSubmitHandler) { }

    public gridsterConfig = {
        minCols: 12,
        maxCols: 12,
        minRows: 12,
    };
    public mockWidgetId = "mockWidget";

    public dashboard: IDashboard = {
        // @ts-ignore: Suppressed for test purposes
        widgets: {
            [this.mockWidgetId]: {
                id: this.mockWidgetId,
                type: "kpi",
                pizzagna: null,
            },
        },
        positions: {
            [this.mockWidgetId]: {
                cols: 6,
                rows: 4,
                y: 0,
                x: 0,
            },
        },
    };
}

describe("WidgetEditorDirective >", () => {
    let fixture: ComponentFixture<WidgetEditorDirectiveTestComponent>;
    let component: WidgetEditorDirectiveTestComponent;
    let widgetEditorDirective: WidgetEditorDirective;
    let dashboardComponent: DashboardComponent;
    let widgetTypesService: WidgetTypesService;

    beforeEach(() => {
        widgetTypesService = new WidgetTypesService();
        widgetTypesService.registerWidgetType("kpi", 1, kpi);

        TestBed
            .configureTestingModule({
                imports: [
                    GridsterModule,
                    PortalModule,
                    RouterTestingModule.withRoutes([]),
                ],
                declarations: [
                    GridsterItemWidgetIdDirective,
                    DashboardComponent,
                    ComponentPortalDirective,
                    PizzagnaComponent,
                    WidgetComponent,
                    WidgetEditorDirectiveTestComponent,
                    WidgetEditorDirective,
                ],
                providers: [
                    ConfiguratorService,
                    WidgetEditorService,
                    { provide: WidgetTypesService, useValue: widgetTypesService },
                    {
                        provide: LoggerService, useValue: mockLoggerService,
                    },
                ],
            });
        fixture = TestBed.createComponent(WidgetEditorDirectiveTestComponent);
        fixture.autoDetectChanges(true);
        component = fixture.componentInstance;
        widgetEditorDirective = fixture.debugElement.childNodes[0].injector.get<WidgetEditorDirective>(WidgetEditorDirective);
        dashboardComponent = fixture.debugElement.childNodes[0].injector.get<DashboardComponent>(DashboardComponent);
    });

    afterEach(() => {
        widgetEditorDirective.ngOnDestroy();
    });

    it("should create", () => {
        expect(widgetEditorDirective).toBeTruthy();
    });

    it("should open the widget editor on event bus WIDGET_EDIT", () => {
        const spy = spyOn((<any>widgetEditorDirective).widgetEditorService, "open").and.returnValue(new Observable());
        dashboardComponent.eventBus.getStream(WIDGET_EDIT).next({ widgetId: component.mockWidgetId });
        expect(spy).toHaveBeenCalled();
    });

    it("should handle removal of a widget on event bus WIDGET_REMOVE", () => {
        const spy = spyOn((<any>widgetEditorDirective).widgetRemovalService, "handleRemove").and.returnValue(new Observable());
        dashboardComponent.eventBus.getStream(WIDGET_REMOVE).next({ widgetId: component.mockWidgetId });
        expect(spy).toHaveBeenCalled();
    });

    describe("ngOnDestroy", () => {
        it("should unsubscribe from the event bus WIDGET_EDIT stream", () => {
            widgetEditorDirective.ngOnDestroy();
            const spy = spyOn((<any>widgetEditorDirective).widgetEditorService, "open").and.returnValue(new Observable());
            dashboardComponent.eventBus.getStream(WIDGET_EDIT).next({ widgetId: component.mockWidgetId });
            expect(spy).not.toHaveBeenCalled();
        });

        it("should unsubscribe from the event bus WIDGET_REMOVE stream", () => {
            widgetEditorDirective.ngOnDestroy();
            const spy = spyOn((<any>widgetEditorDirective).widgetRemovalService, "handleRemove").and.returnValue(new Observable());
            dashboardComponent.eventBus.getStream(WIDGET_REMOVE).next({ widgetId: component.mockWidgetId });
            expect(spy).not.toHaveBeenCalled();
        });
    });

});
