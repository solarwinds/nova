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
import { FormBuilder } from "@angular/forms";

import { EventBus } from "@nova-ui/bits";
import { PIZZAGNA_EVENT_BUS } from "@nova-ui/dashboards";

import { IFormatterDefinition } from "../../../../../../../components/types";
import { NuiDashboardsModule } from "../../../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../../../services/provider-registry.service";
import { PresentationConfigurationV2Component } from "./presentation-configuration-v2.component";

describe("PresentationConfigurationV2Component", () => {
    let component: PresentationConfigurationV2Component;
    let fixture: ComponentFixture<PresentationConfigurationV2Component>;
    let formBuilder: FormBuilder;
    const rawFormatter: IFormatterDefinition = {
        componentType: "RawFormatterComponent",
        label: $localize`No Formatter`,
        dataTypes: {
            // @ts-ignore: Suppressed for test purposes
            value: null,
        },
    };
    const linkFormatter: IFormatterDefinition = {
        componentType: "LinkFormatterComponent",
        label: $localize`Link`,
        configurationComponent: "LinkConfiguratorComponent",
        dataTypes: {
            value: "label",
            link: "link",
        },
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PresentationConfigurationV2Component);
        component = fixture.componentInstance;
        formBuilder = new FormBuilder();
        component.formControl = formBuilder.control({});
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("propertiesForm >", () => {
        it("should patch form when formatters are changed", () => {
            component.formatters = [rawFormatter, linkFormatter];
            component.ngOnInit();

            component.form.get("properties")?.setValue({
                dataFieldIds: { value: "firstUrlLabel", link: "firstUrl" },
            });

            const propertiesForm = formBuilder.group({
                dataFieldIds: { value: "", link: "" },
            });
            component.onFormReady(propertiesForm);

            expect(component.propertiesForm).toBe(propertiesForm);
            expect(component.propertiesForm.value.dataFieldIds.value).toEqual(
                "firstUrlLabel"
            );
            expect(component.propertiesForm.value.dataFieldIds.link).toEqual(
                "firstUrl"
            );
        });
    });
});
