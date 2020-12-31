import { ChangeDetectorRef, Component, SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoggerService, NuiFormFieldModule, NuiSelectV2Module, NuiValidationMessageModule } from "@nova-ui/bits";

import { IFormatterDefinition } from "../../../../../../../../components/types";

import { FormatterConfiguratorComponent } from "./formatter-configurator.component";

@Component({
    selector: "nui-formatter-configurator-test",
    template: "",
})
class FormatterConfiguratorTestComponent extends FormatterConfiguratorComponent {
    constructor(changeDetector: ChangeDetectorRef, formBuilder: FormBuilder, logger: LoggerService) {
        super(changeDetector, formBuilder, logger);
    }
}

const DATA_FIELDS = [
    {id: "position", label: $localize`Position`, dataType: "number"},
    {id: "name", label: $localize`Name`, dataType: "string"},
    {id: "features", label: $localize`Features`, dataType: "icons"},
    {id: "checks", label: $localize`Checks`, dataType: "iconAndText"},
    {id: "status", label: $localize`Status`, dataType: "string"},
    {id: "firstUrl", label: $localize`First Url`, dataType: "link"},
    {id: "firstUrlLabel", label: $localize`First Url Label`, dataType: "label"},
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FormatterConfiguratorTestComponent,
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                NuiFormFieldModule,
                NuiSelectV2Module,
                NuiValidationMessageModule,
            ],
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
            component.formatterDefinition.dataTypes["value"] = ["string", "number"];
            component.mapDropdownItems();

            expect(component.dropdownItems["value"][0].id).toEqual("position");
            expect(component.dropdownItems["value"][1].id).toEqual("name");
            expect(component.dropdownItems["value"][2].id).toEqual("status");
        });

        it("should include all data fields when no types are defined", () => {
            // @ts-ignore: Suppressed for test purposes
            component.formatterDefinition.dataTypes["value"] = null;
            component.mapDropdownItems();

            expect(component.dropdownItems["value"].length).toEqual(component.dataFields.length);
        });

    });

    describe("addCustomFormControls", () => {
        it("adds custom form controls", () => {
            (component as any).addCustomFormControls = function (this: FormatterConfiguratorComponent, form: FormGroup) {
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

            component.ngOnChanges({formatterDefinition: new SimpleChange(null, null, true)});

            expect(component.form.get("custom")).toBeDefined();
        });
    });

    describe("change of formatter", () => {
        it("should set the dataField form value to 'null' when new formatter does not support old value", () => {
            component.formatterDefinition = {...FORMATTER_DEFINITION, dataTypes: {value: ["string"]}};
            component.dataFields = DATA_FIELDS;
            component.mapDropdownItems();
            component.initForm();
            component.formatterDefinition = {...FORMATTER_DEFINITION, dataTypes: {value: ["number"]}};

            component.mapDropdownItems();
            component.initForm();

            expect(component.form.get("dataFieldIds")?.value.value).toEqual(null);
            expect(component.form.valid).toEqual(false);
        });
    });
});
