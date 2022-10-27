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

import { ChangeDetectorRef, Component, SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";

import {
    LoggerService,
    NuiFormFieldModule,
    NuiSelectV2Module,
    NuiValidationMessageModule,
} from "@nova-ui/bits";

import { IFormatterDefinition } from "../../../../../../../../components/types";
import { ConfiguratorHeadingService } from "../../../../../../../services/configurator-heading.service";
import { FormatterConfiguratorComponent } from "./formatter-configurator.component";

@Component({
    selector: "nui-formatter-configurator-test",
    template: "",
})
class FormatterConfiguratorTestComponent extends FormatterConfiguratorComponent {
    constructor(
        changeDetector: ChangeDetectorRef,
        formBuilder: FormBuilder,
        logger: LoggerService,
        configuratoeHeading: ConfiguratorHeadingService
    ) {
        super(changeDetector, configuratoeHeading, formBuilder, logger);
    }
}

const DATA_FIELDS = [
    { id: "position", label: $localize`Position`, dataType: "number" },
    { id: "name", label: $localize`Name`, dataType: "string" },
    { id: "features", label: $localize`Features`, dataType: "icons" },
    { id: "checks", label: $localize`Checks`, dataType: "iconAndText" },
    { id: "status", label: $localize`Status`, dataType: "string" },
    { id: "firstUrl", label: $localize`First Url`, dataType: "link" },
    {
        id: "firstUrlLabel",
        label: $localize`First Url Label`,
        dataType: "label",
    },
];
const FORMATTER_DEFINITION: IFormatterDefinition = {
    label: $localize`Test Formatter`,
    componentType: "componentType",
    configurationComponent: "configurationComponent",
    dataTypes: {
        value: [],
    },
};

describe("FormatterConfiguratorComponent", () => {
    let component: FormatterConfiguratorTestComponent;
    let fixture: ComponentFixture<FormatterConfiguratorTestComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FormatterConfiguratorTestComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                NuiFormFieldModule,
                NuiSelectV2Module,
                NuiValidationMessageModule,
            ],
            providers: [ConfiguratorHeadingService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormatterConfiguratorTestComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("dropdownItems", () => {
        beforeEach(() => {
            component.formatterDefinition = FORMATTER_DEFINITION;
            component.dataFields = DATA_FIELDS;
        });

        it("should update dataField items", () => {
            component.formatterDefinition.dataTypes["value"] = [
                "string",
                "number",
            ];
            component.mapDropdownItems();

            expect(component.dropdownItems["value"][0].id).toEqual("position");
            expect(component.dropdownItems["value"][1].id).toEqual("name");
            expect(component.dropdownItems["value"][2].id).toEqual("status");
        });

        it("should include all data fields when no types are defined", () => {
            // @ts-ignore: Suppressed for test purposes
            component.formatterDefinition.dataTypes["value"] = null;
            component.mapDropdownItems();

            expect(component.dropdownItems["value"].length).toEqual(
                component.dataFields.length
            );
        });
    });

    describe("addCustomFormControls", () => {
        it("adds custom form controls", () => {
            (component as any).addCustomFormControls = function (
                this: FormatterConfiguratorComponent,
                form: FormGroup
            ) {
                form.addControl("custom", this.formBuilder.control(""));
            };
            component.formatterDefinition = {
                componentType: "custom",
                label: "Custom Formatter",
                dataTypes: {
                    // @ts-ignore: Suppressed for test purposes
                    value: null,
                    // @ts-ignore: Suppressed for test purposes
                    custom: null,
                },
            };
            component.dataFields = DATA_FIELDS;

            component.ngOnChanges({
                formatterDefinition: new SimpleChange(null, null, true),
            });

            expect(component.form.get("custom")).toBeDefined();
        });
    });

    describe("change of formatter", () => {
        it("should set the dataField form value to 'null' when new formatter does not support old value", () => {
            component.formatterDefinition = {
                ...FORMATTER_DEFINITION,
                dataTypes: { value: ["string"] },
            };
            component.dataFields = DATA_FIELDS;
            component.mapDropdownItems();
            component.initForm();
            component.formatterDefinition = {
                ...FORMATTER_DEFINITION,
                dataTypes: { value: ["number"] },
            };

            component.mapDropdownItems();
            component.initForm();

            expect(component.form.get("dataFieldIds")?.value.value).toEqual(
                null
            );
            expect(component.form.valid).toEqual(false);
        });
    });
});
