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

import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../dashboards.module";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { ProviderRegistryService } from "../../../services/provider-registry.service";
import { PIZZAGNA_EVENT_BUS } from "../../../types";
import { WidgetEditorAccordionComponent } from "./widget-editor-accordion.component";

describe("WidgetEditorAccordionComponent", () => {
    let component: WidgetEditorAccordionComponent;
    let fixture: ComponentFixture<WidgetEditorAccordionComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                PizzagnaService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetEditorAccordionComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit > ", () => {
        it("should register itself with the WidgetEditorSectionCoordinatorService", () => {
            const registrationSpy = spyOn(
                (<any>component).accordionCoordinator,
                "registerAccordion"
            );
            component.ngOnInit();
            expect(registrationSpy).toHaveBeenCalledWith(component);
        });
    });

    describe("openChange > ", () => {
        it("should emit the openSubject", () => {
            const openSubjectSpy = spyOn(component.openSubject, "next");
            component.openChange(true);
            expect(openSubjectSpy).toHaveBeenCalled();
        });

        it("should invoke closeAccordion", () => {
            const closeAccordionSpy = spyOn(component, "closeAccordion");
            component.openChange(false);
            expect(closeAccordionSpy).toHaveBeenCalled();
        });
    });

    describe("closeAccordion > ", () => {
        it("should invoke markForCheck on the ChangeDetectorRef", () => {
            const markForCheckSpy = spyOn(component.cd, "markForCheck");
            component.closeAccordion();
            expect(markForCheckSpy).toHaveBeenCalled();
        });

        it("should set open to false", () => {
            component.open = true;
            component.closeAccordion();
            expect(component.open).toEqual(false);
        });
    });

    describe("ngOnDestroy > ", () => {
        it("should invoke next on the destroySubject", () => {
            const destroyNextSpy = spyOn(component.destroySubject, "next");
            component.ngOnDestroy();
            expect(destroyNextSpy).toHaveBeenCalled();
        });
    });
});
