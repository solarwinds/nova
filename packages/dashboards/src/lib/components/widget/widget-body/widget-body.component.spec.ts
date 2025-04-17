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

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EventBus, IEvent } from "@nova-ui/bits";

import { WidgetBodyComponent } from "./widget-body.component";
import { NuiDashboardsModule } from "../../../dashboards.module";
import { DynamicComponentCreator } from "../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { DASHBOARD_EDIT_MODE } from "../../../services/types";
import { IPizza, PIZZAGNA_EVENT_BUS } from "../../../types";

describe("WidgetBodyComponent", () => {
    let component: WidgetBodyComponent;
    let fixture: ComponentFixture<WidgetBodyComponent>;
    let eventBus: EventBus<IEvent>;
    let dynamicComponentCreator: DynamicComponentCreator;
    let pizzagnaService: PizzagnaService;
    const testComponents: IPizza = {
        component1: {
            id: "component1",
            componentType: "compType1",
        },
        component2: {
            id: "component2",
            componentType: "compType2",
        },
    };

    beforeEach(waitForAsync(() => {
        eventBus = new EventBus();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(
            eventBus,
            dynamicComponentCreator
        );
        pizzagnaService.updateComponents(testComponents);

        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                DynamicComponentCreator,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
                {
                    provide: PizzagnaService,
                    useValue: pizzagnaService,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetBodyComponent);
        component = fixture.componentInstance;
        component.componentId = "body";
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit", () => {
        it("should initialize 'classNames'", () => {
            component.elementClass = "test-class";
            component.ngOnInit();
            expect(component.classNames).toEqual(
                `${component.defaultClasses} ${component.elementClass}`
            );
        });

        it("should subscribe to the 'DASHBOARD_EDIT_MODE' event", () => {
            const spy = spyOn(pizzagnaService, "setProperty");
            component.ngOnInit();
            eventBus.getStream(DASHBOARD_EDIT_MODE).next({ payload: true });

            expect(spy).toHaveBeenCalledWith(
                {
                    componentId: "body",
                    pizzagnaKey: "data",
                    propertyPath: ["editMode"],
                },
                true
            );

            eventBus.getStream(DASHBOARD_EDIT_MODE).next({ payload: false });

            expect(spy).toHaveBeenCalledWith(
                {
                    componentId: "body",
                    pizzagnaKey: "data",
                    propertyPath: ["editMode"],
                },
                false
            );
        });
    });

    describe("ngOnDestroy", () => {
        it("should unsubscribe from the 'DASHBOARD_EDIT_MODE' event", () => {
            const spy = spyOn(pizzagnaService, "setProperty");
            component.ngOnInit();
            component.ngOnDestroy();
            eventBus.getStream(DASHBOARD_EDIT_MODE).next({ payload: true });

            expect(spy).not.toHaveBeenCalled();
        });
    });
});
