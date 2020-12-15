import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../dashboards.module";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { ProviderRegistryService } from "../../../services/provider-registry.service";
import { PIZZAGNA_EVENT_BUS } from "../../../types";

import { WidgetEditorAccordionComponent } from "./widget-editor-accordion.component";

describe("WidgetEditorAccordionComponent", () => {
    let component: WidgetEditorAccordionComponent;
    let fixture: ComponentFixture<WidgetEditorAccordionComponent>;

    beforeEach(async(() => {
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
        })
            .compileComponents();
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
            const registrationSpy = spyOn((<any>component).accordionCoordinator, "registerAccordion");
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
