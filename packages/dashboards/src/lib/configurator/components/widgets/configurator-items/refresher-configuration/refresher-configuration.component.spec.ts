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

import { RefreshRateConfiguratorComponent } from "./refresh-rate-configurator/refresh-rate-configurator.component";
import { RefresherConfigurationComponent } from "./refresher-configuration.component";
import { WidgetEditorAccordionFormStatePipe } from "../../../../pipe/widget-editor-accordion-form-state.pipe";
import { FormHeaderIconPipePipe } from "../../../../pipe/widget-editor-accordion-header-icon.pipe";
import { WidgetConfiguratorSectionCoordinatorService } from "../../../widget-configurator-section/widget-configurator-section-coordinator.service";
import { WidgetEditorAccordionComponent } from "../../../widget-editor-accordion/widget-editor-accordion.component";

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
