import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EventBus } from "@solarwinds/nova-bits";

import { NuiDashboardsModule } from "../../../dashboards.module";
import { ProviderRegistryService } from "../../../services/provider-registry.service";
import { IPizzagna, PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../../types";

import { ConfiguratorComponent } from "./configurator.component";

describe("ConfiguratorComponent", () => {
    let component: ConfiguratorComponent;
    let fixture: ComponentFixture<ConfiguratorComponent>;
    let testPizzagna: IPizzagna;
    let detectChangesSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        }).overrideComponent(ConfiguratorComponent, {
            // disable styles to prevent configurator backdrop from covering the karma browser gui
            set: {
                styles: [],
            },
        }).compileComponents();
    }));

    beforeEach(() => {
        testPizzagna = {
            [PizzagnaLayer.Configuration]: {},
            [PizzagnaLayer.Data]: {},
            [PizzagnaLayer.Structure]: {},
        };
        fixture = TestBed.createComponent(ConfiguratorComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        detectChangesSpy = spyOn(component.changeDetector, "detectChanges");
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should use the placeholder widget in the preview by default", () => {
        expect(component.previewWidget?.type).toEqual("previewPlaceholder");
    });

    // it("should define the form", () => {
    //     expect(component.form instanceof FormGroup).toEqual(true);
    // });
    //
    // describe("ngOnInit > ", () => {
    //     it("should set the previewClone using the previewPizzagna", () => {
    //         component.previewPizzagna = testPizzagna;
    //         component.ngOnInit();
    //         expect(component.previewClone[PizzagnaLayer.Configuration]).toEqual(testPizzagna[PizzagnaLayer.Configuration]);
    //         expect(component.previewClone[PizzagnaLayer.Structure]).toEqual(testPizzagna[PizzagnaLayer.Structure]);
    //         expect(component.previewClone[PizzagnaLayer.Data]).toBeUndefined();
    //     });
    //
    //     it("should set the form's value", () => {
    //         component.previewPizzagna = testPizzagna;
    //         component.ngOnInit();
    //         expect(component.form.value).toEqual({});
    //     });
    // });
    //
    // describe("ngAfterViewInit > ", () => {
    //     beforeEach(() => {
    //         component.previewPizzagna = testPizzagna;
    //         component.ngOnInit();
    //     });
    //
    //     it("should invoke detectChanges", () => {
    //         component.ngAfterViewInit();
    //         expect(detectChangesSpy).toHaveBeenCalled();
    //     });
    //
    //     it("should update the formPizzagna with the preview configuration", () => {
    //         testPizzagna[PizzagnaLayer.Configuration] = { test: {} };
    //         component.previewPizzagna = testPizzagna;
    //         component.formPizzagna = { ...testPizzagna };
    //         component.ngOnInit();
    //         component.ngAfterViewInit();
    //         expect(component.formPizzagna.data["/"].properties.preview).toEqual(component.previewClone[PizzagnaLayer.Configuration]);
    //     });
    // });
    //
    // describe("onPreviewUpdate > ", () => {
    //     it("should update the previewClone's configuration with the payload", () => {
    //         testPizzagna[PizzagnaLayer.Configuration] = { test: {} };
    //         component.previewPizzagna = testPizzagna;
    //         const expectedPreviewConfiguration = { expected: {} };
    //         component.ngOnInit();
    //         component.onPreviewUpdate({ payload: expectedPreviewConfiguration });
    //         expect(component.previewClone[PizzagnaLayer.Configuration]).toEqual(expectedPreviewConfiguration);
    //     });
    // });
    //
});
