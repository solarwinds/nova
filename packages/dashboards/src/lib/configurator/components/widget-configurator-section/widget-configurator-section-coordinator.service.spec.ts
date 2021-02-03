import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EventBus } from "@nova-ui/bits";
import { Subscriber } from "rxjs";

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
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetEditorAccordionComponent);
        component = fixture.componentInstance;
    });

    describe("registerAccordion > ", () => {
        it("should register the accordion component", () => {
            service.registerAccordion(component);
            expect((<any>service).accordions[0].instance).toEqual(component);
            expect((<any>service).accordions[0].openSubscription instanceof Subscriber).toEqual(true);
            expect((<any>service).accordions[0].destroySubscription instanceof Subscriber).toEqual(true);
        });

        it("should invoke closeAllAccordions on component.openSubject.next", () => {
            service.registerAccordion(component);
            const closeAllSpy = spyOn((<any>service), "closeAllAccordions");
            component.openSubject.next();
            expect(closeAllSpy).toHaveBeenCalled();
        });

        it("should invoke removeAccordion on component.destroySubject.next", () => {
            service.registerAccordion(component);
            const removeSpy = spyOn((<any>service), "removeAccordion");
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
            const unsubscribeSpy = spyOn((<any>service).accordions[0].openSubscription, "unsubscribe");
            component.ngOnDestroy(); // removeAccordion is invoked on component destroy
            expect(unsubscribeSpy).toHaveBeenCalled();
        });

        it("should remove the associated AccordionCoordinatorState", () => {
            component.ngOnDestroy(); // removeAccordion is invoked on component destroy
            expect((<any>service).accordions.length).toEqual(0);
        });
    });
});
