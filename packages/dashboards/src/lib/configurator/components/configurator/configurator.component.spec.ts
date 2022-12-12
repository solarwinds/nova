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

import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../dashboards.module";
import { ProviderRegistryService } from "../../../services/provider-registry.service";
import { IPizzagna, PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../types";
import { ConfiguratorComponent } from "./configurator.component";

describe("ConfiguratorComponent", () => {
    let component: ConfiguratorComponent;
    let fixture: ComponentFixture<ConfiguratorComponent>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let testPizzagna: IPizzagna;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let detectChangesSpy: jasmine.Spy;

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
        })
            .overrideComponent(ConfiguratorComponent, {
                // disable styles to prevent configurator backdrop from covering the karma browser gui
                set: {
                    styles: [],
                },
            })
            .compileComponents();
    }));

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        testPizzagna = {
            [PizzagnaLayer.Configuration]: {},
            [PizzagnaLayer.Data]: {},
            [PizzagnaLayer.Structure]: {},
        };
        fixture = TestBed.createComponent(ConfiguratorComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
