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

import { NuiDashboardsModule } from "../../../dashboards.module";
import { DynamicComponentCreator } from "../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS } from "../../../types";
import { ErrorNodeKey } from "../../../widget-types/common/widget/types";
import { WidgetBodyContentComponent } from "./widget-body-content.component";

describe("WidgetBodyContentComponent", () => {
    let component: WidgetBodyContentComponent;
    let fixture: ComponentFixture<WidgetBodyContentComponent>;
    let eventBus: EventBus<IEvent>;
    let dynamicComponentCreator: DynamicComponentCreator;
    let pizzagnaService: PizzagnaService;

    beforeEach(waitForAsync(() => {
        eventBus = new EventBus();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(
            eventBus,
            dynamicComponentCreator
        );

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
        fixture = TestBed.createComponent(WidgetBodyContentComponent);
        component = fixture.componentInstance;
        component.componentId = "bodyContent";
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("getNodes", () => {
        it("should not include a fallback node in its result if the fallbackKey is undefined", () => {
            component.primaryContent = "primaryContent";
            // @ts-ignore: Suppressed for test purposes
            component.fallbackKey = undefined;
            expect(component.getNodes()).toEqual([component.primaryContent]);
        });

        it("should include ErrorNodeKey.ErrorUnknown node key in its result if the 'fallbackMap' is undefined", () => {
            component.primaryContent = "primaryContent";
            component.fallbackKey = "fallbackKey";
            expect(component.getNodes()).toEqual([
                component.primaryContent,
                ErrorNodeKey.ErrorUnknown,
            ]);
        });

        it(`should include ErrorNodeKey.ErrorUnknown node key in its result if the
        'fallbackMap' is defined but does not contain the specified callback key`, () => {
            component.primaryContent = "primaryContent";
            component.fallbackKey = "fallbackKey";
            component.fallbackMap = {
                otherFallbackKey: "fallbackNodeKey",
            };
            expect(component.getNodes()).toEqual([
                component.primaryContent,
                ErrorNodeKey.ErrorUnknown,
            ]);
        });

        it("should include the mapped node key in its result if the 'fallbackMap' is defined and contains the specified callback key", () => {
            component.primaryContent = "primaryContent";
            component.fallbackKey = "fallbackKey";
            component.fallbackMap = {
                fallbackKey: "fallbackNodeKey",
            };
            expect(component.getNodes()).toEqual([
                component.primaryContent,
                component.fallbackMap[component.fallbackKey],
            ]);
        });
    });
});
