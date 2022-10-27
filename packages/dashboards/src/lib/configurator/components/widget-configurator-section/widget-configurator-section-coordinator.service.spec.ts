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
import { Subscriber } from "rxjs";

import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../dashboards.module";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { ProviderRegistryService } from "../../../services/provider-registry.service";
import { PIZZAGNA_EVENT_BUS } from "../../../types";
import { WidgetEditorAccordionComponent } from "../widget-editor-accordion/widget-editor-accordion.component";
import { WidgetConfiguratorSectionCoordinatorService } from "./widget-configurator-section-coordinator.service";

describe("WidgetConfiguratorSectionCoordinatorService", () => {
    let service: WidgetConfiguratorSectionCoordinatorService;
    let component: WidgetEditorAccordionComponent;
    let fixture: ComponentFixture<WidgetEditorAccordionComponent>;

    beforeEach(waitForAsync(() => {
        service = new WidgetConfiguratorSectionCoordinatorService();

        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                PizzagnaService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
                {
                    provide: WidgetConfiguratorSectionCoordinatorService,
                    useValue: service,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetEditorAccordionComponent);
        component = fixture.componentInstance;
    });

    describe("registerAccordion > ", () => {
        it("should register the accordion component", () => {
            service.registerAccordion(component);
            expect((<any>service).accordions[0].instance).toEqual(component);
            expect(
                (<any>service).accordions[0].openSubscription instanceof
                    Subscriber
            ).toEqual(true);
            expect(
                (<any>service).accordions[0].destroySubscription instanceof
                    Subscriber
            ).toEqual(true);
        });

        it("should invoke closeAllAccordions on component.openSubject.next", () => {
            service.registerAccordion(component);
            const closeAllSpy = spyOn(<any>service, "closeAllAccordions");
            component.openSubject.next();
            expect(closeAllSpy).toHaveBeenCalled();
        });

        it("should invoke removeAccordion on component.destroySubject.next", () => {
            service.registerAccordion(component);
            const removeSpy = spyOn(<any>service, "removeAccordion");
            component.destroySubject.next();
            expect(removeSpy).toHaveBeenCalled();
        });
    });

    describe("closeAllAccordions > ", () => {
        beforeEach(() => {
            service.registerAccordion(component);
        });

        it("should invoke closeAccordion on all accordions", () => {
            const closeAccordionSpy = spyOn(component, "closeAccordion");
            (<any>service).closeAllAccordions();
            expect(closeAccordionSpy).toHaveBeenCalled();
        });
    });

    describe("removeAccordion > ", () => {
        beforeEach(() => {
            service.registerAccordion(component);
        });

        it("should unsubscribe from the openSubscription", () => {
            const unsubscribeSpy = spyOn(
                (<any>service).accordions[0].openSubscription,
                "unsubscribe"
            );
            component.ngOnDestroy(); // removeAccordion is invoked on component destroy
            expect(unsubscribeSpy).toHaveBeenCalled();
        });

        it("should remove the associated AccordionCoordinatorState", () => {
            component.ngOnDestroy(); // removeAccordion is invoked on component destroy
            expect((<any>service).accordions.length).toEqual(0);
        });
    });
});
