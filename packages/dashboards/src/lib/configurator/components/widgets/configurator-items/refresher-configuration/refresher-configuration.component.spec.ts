import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import {
    NuiExpanderModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiSelectV2Module,
    NuiSwitchModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
} from "@nova-ui/bits";

import { WidgetEditorAccordionFormStatePipe } from "../../../../pipe/widget-editor-accordion-form-state.pipe";
import { FormHeaderIconPipePipe } from "../../../../pipe/widget-editor-accordion-header-icon.pipe";
import { WidgetConfiguratorSectionCoordinatorService } from "../../../widget-configurator-section/widget-configurator-section-coordinator.service";
import { WidgetEditorAccordionComponent } from "../../../widget-editor-accordion/widget-editor-accordion.component";

import { RefreshRateConfiguratorComponent } from "./refresh-rate-configurator/refresh-rate-configurator.component";
import { RefresherConfigurationComponent } from "./refresher-configuration.component";

describe("RefresherConfigurationComponent", () => {
    let component: RefresherConfigurationComponent;
    let fixture: ComponentFixture<RefresherConfigurationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                RefresherConfigurationComponent,
                RefreshRateConfiguratorComponent,
                WidgetEditorAccordionFormStatePipe,
                WidgetEditorAccordionComponent,
                FormHeaderIconPipePipe,
            ],
            imports: [
                ReactiveFormsModule,
                NuiExpanderModule,
                NuiTextboxModule,
                NuiSelectV2Module,
                NuiValidationMessageModule,
                NuiIconModule,
                NuiFormFieldModule,
                NuiSwitchModule,
            ],
            providers: [
                FormBuilder,
                WidgetConfiguratorSectionCoordinatorService,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RefresherConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("seconds to label", () => {
        it("should convert random seconds to proper seconds label", () => {
            const label = component.getDurationLabel(54);
            expect(label).toEqual("54 sec");
        });

        it("should convert random seconds to proper minutes label", () => {
            const label = component.getDurationLabel(654);
            expect(label).toEqual("10 min 54 sec");
        });

        it("should convert random seconds to proper hour label", () => {
            const label = component.getDurationLabel(6054);
            expect(label).toEqual("1 h 40 min 54 sec");
        });

        it("should convert random seconds to proper hour label more than 23h", () => {
            const label = component.getDurationLabel(600054);
            expect(label).toEqual("166 h 40 min 54 sec");
        });

        it("should convert 60 seconds to one minute ", () => {
            const label = component.getDurationLabel(60);
            expect(label).toEqual("1 min");
        });

        it("should convert 3600 seconds to one hour ", () => {
            const label = component.getDurationLabel(3600);
            expect(label).toEqual("1 h");
        });

        it("should convert 0 seconds to 0 seconds", () => {
            const label = component.getDurationLabel(0);
            expect(label).toEqual("0 sec");
        });
    });
});
