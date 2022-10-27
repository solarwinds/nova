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

import { IFormatterDefinition } from "../../../../../../../components/types";
import { NuiDashboardsModule } from "../../../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../../../services/provider-registry.service";
import { PresentationConfigurationComponent } from "./presentation-configuration.component";

describe("PresentationConfigurationComponent", () => {
    let component: PresentationConfigurationComponent;
    let fixture: ComponentFixture<PresentationConfigurationComponent>;
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
            providers: [ProviderRegistryService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PresentationConfigurationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("should filter formatters based on the dataTypes provided in the dataFields input propriety", () => {
        // multiple datasets for the same test
        [
            {
                providedDataFields: [
                    {
                        id: "position",
                        label: $localize`Position`,
                        dataType: "number",
                    },
                ],
                expectedFormatters: [rawFormatter],
            },
            {
                providedDataFields: [
                    {
                        id: "position",
                        label: $localize`Position`,
                        dataType: "number",
                    },
                    {
                        id: "firstUrlLabel",
                        label: $localize`First Url Label`,
                        dataType: "label",
                    },
                ],
                expectedFormatters: [rawFormatter, linkFormatter],
            },
        ].forEach((testData) => {
            const dataTypes = testData.providedDataFields.map(
                (df) => df.dataType
            );
            it(`- case ${dataTypes}`, () => {
                component.formatters = [rawFormatter, linkFormatter];
                component.dataFields = testData.providedDataFields;

                fixture.detectChanges();

                expect(component.formatters).toEqual(
                    testData.expectedFormatters
                );
            });
        });
    });

    describe("createFormatterConfigurator", () => {
        it("clears formatter datafields on componentType change", () => {
            component.formatters = [rawFormatter, linkFormatter];
            component.formatter = {
                componentType: rawFormatter.componentType,
                properties: {
                    dataFieldIds: {
                        value: "john",
                    },
                },
            };

            component.ngOnInit();

            expect(
                component.formatterConfiguratorProps.formatter?.properties
                    ?.dataFieldIds?.value
            ).toEqual("john");
            component.formatterForm.controls["componentType"].setValue(
                linkFormatter.componentType
            );

            expect(
                component.formatterConfiguratorProps.formatter?.properties
                    ?.dataFieldIds?.value
            ).toBeFalsy(); // null
        });
    });
});
