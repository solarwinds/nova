import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { IFormatterDefinition } from "../../../../../../../components/types";
import { NuiDashboardsModule } from "../../../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../../../services/provider-registry.service";

import { PresentationConfigurationV2Component } from "./presentation-configuration-v2.component";
import { PIZZAGNA_EVENT_BUS } from "@nova-ui/dashboards";
import { EventBus } from "@nova-ui/bits";
import { AbstractControl, FormBuilder } from "@angular/forms";

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
            component.onFormReady(formBuilder.group({
                dataFieldIds: {value: "firstUrlLabel", link: "firstUrl"}
            }));
            expect(component.form.value.properties.dataFieldIds.value).toEqual("firstUrlLabel")
            expect(component.form.value.properties.dataFieldIds.link).toEqual("firstUrl")

        });
    });
});
