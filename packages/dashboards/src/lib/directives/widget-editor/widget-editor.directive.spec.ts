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

import { PortalModule } from "@angular/cdk/portal";
import { Component, Injectable } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { GridsterModule } from "angular-gridster2";
import { Observable } from "rxjs";

import { LoggerService } from "@nova-ui/bits";

import { WidgetEditorDirective } from "./widget-editor.directive";
import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import {
    IDashboard,
    IDashboardPersistenceHandler,
} from "../../components/dashboard/types";
import { IWidget } from "../../components/widget/types";
import { WidgetComponent } from "../../components/widget/widget.component";
import { ConfiguratorService } from "../../configurator/services/configurator.service";
import { IConfiguratorSource } from "../../configurator/services/types";
import { WidgetEditorService } from "../../configurator/services/widget-editor.service";
import { mockLoggerService } from "../../mocks.spec";
import { PizzagnaComponent } from "../../pizzagna/components/pizzagna/pizzagna.component";
import { ComponentPortalDirective } from "../../pizzagna/directives/component-portal/component-portal.directive";
import { WIDGET_EDIT, WIDGET_REMOVE } from "../../services/types";
import { WidgetTypesService } from "../../services/widget-types.service";
import { kpi } from "../../widget-types/kpi/kpi";
import { GridsterItemWidgetIdDirective } from "../gridster-item-widget-id/gridster-item-widget-id.directive";

@Injectable()
class MockSubmitHandler implements IDashboardPersistenceHandler {
    public trySubmit(
        widget: IWidget,
        source: IConfiguratorSource
    ): Observable<IWidget> {
        // @ts-ignore: Suppressed for test purposes
        return null;
    }
}

@Component({
    template: `
        <nui-dashboard
            [nuiWidgetEditor]="submitHandler"
            [(dashboard)]="dashboard"
            [(gridsterConfig)]="gridsterConfig"
        >
        </nui-dashboard>
    `,
    providers: [MockSubmitHandler],
    standalone: false
})
class WidgetEditorDirectiveTestComponent {
    constructor(public submitHandler: MockSubmitHandler) {}

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

        TestBed.configureTestingModule({
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
                    provide: LoggerService,
                    useValue: mockLoggerService,
                },
            ],
        });
        fixture = TestBed.createComponent(WidgetEditorDirectiveTestComponent);
        fixture.autoDetectChanges(true);
        component = fixture.componentInstance;
        widgetEditorDirective =
            fixture.debugElement.childNodes[0].injector.get<WidgetEditorDirective>(
                WidgetEditorDirective
            );
        dashboardComponent =
            fixture.debugElement.childNodes[0].injector.get<DashboardComponent>(
                DashboardComponent
            );
    });

    afterEach(() => {
        widgetEditorDirective.ngOnDestroy();
    });

    it("should create", () => {
        expect(widgetEditorDirective).toBeTruthy();
    });

    it("should open the widget editor on event bus WIDGET_EDIT", () => {
        const spy = spyOn(
            (<any>widgetEditorDirective).widgetEditorService,
            "open"
        ).and.returnValue(new Observable());
        dashboardComponent.eventBus
            .getStream(WIDGET_EDIT)
            .next({ widgetId: component.mockWidgetId });
        expect(spy).toHaveBeenCalled();
    });

    it("should handle removal of a widget on event bus WIDGET_REMOVE", () => {
        const spy = spyOn(
            (<any>widgetEditorDirective).widgetRemovalService,
            "handleRemove"
        ).and.returnValue(new Observable());
        dashboardComponent.eventBus
            .getStream(WIDGET_REMOVE)
            .next({ widgetId: component.mockWidgetId });
        expect(spy).toHaveBeenCalled();
    });

    describe("ngOnDestroy", () => {
        it("should unsubscribe from the event bus WIDGET_EDIT stream", () => {
            widgetEditorDirective.ngOnDestroy();
            const spy = spyOn(
                (<any>widgetEditorDirective).widgetEditorService,
                "open"
            ).and.returnValue(new Observable());
            dashboardComponent.eventBus
                .getStream(WIDGET_EDIT)
                .next({ widgetId: component.mockWidgetId });
            expect(spy).not.toHaveBeenCalled();
        });

        it("should unsubscribe from the event bus WIDGET_REMOVE stream", () => {
            widgetEditorDirective.ngOnDestroy();
            const spy = spyOn(
                (<any>widgetEditorDirective).widgetRemovalService,
                "handleRemove"
            ).and.returnValue(new Observable());
            dashboardComponent.eventBus
                .getStream(WIDGET_REMOVE)
                .next({ widgetId: component.mockWidgetId });
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
