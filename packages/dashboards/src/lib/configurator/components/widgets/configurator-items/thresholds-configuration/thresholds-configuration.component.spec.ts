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

import { ThresholdsConfigurationComponent } from "./thresholds-configuration.component";
import { thresholdsValidator } from "./thresholds-validator";
import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";

describe("ThresholdsConfigurationComponent > ", () => {
    let component: ThresholdsConfigurationComponent;
    let fixture: ComponentFixture<ThresholdsConfigurationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [ProviderRegistryService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ThresholdsConfigurationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit > ", () => {
        it("should build a form", () => {
            expect(component.form).toBeUndefined();
            component.ngOnInit();
            expect(component.form.get("criticalThresholdValue")).not.toBeNull();
            expect(component.form.get("warningThresholdValue")).not.toBeNull();
            expect(component.form.get("showThresholds")).not.toBeNull();
            expect(component.form.get("reversedThresholds")).not.toBeNull();
            expect(component.form.validator).toEqual(thresholdsValidator);
        });

        it("should subscribe to form.statusChanges", () => {
            component.showThresholds = true;
            component.reversedThresholds = false;
            component.warningThresholdValue = 20;
            component.criticalThresholdValue = 30;

            component.ngOnInit();
            const formSpy = spyOn(component.form, "markAllAsTouched");
            const cdSpy = spyOn((<any>component).cd, "detectChanges");
            component.form.get("criticalThresholdValue")?.setValue(19);
            expect(formSpy).toHaveBeenCalled();
            expect(cdSpy).toHaveBeenCalled();
        });

        it("should emit formReady", () => {
            const spy = spyOn(component.formReady, "emit");
            component.ngOnInit();
            expect(spy).toHaveBeenCalledWith(component.form);
        });
    });

    describe("ngOnDestroy > ", () => {
        it("should unsubscribe from form.statusChanges", () => {
            component.showThresholds = true;
            component.reversedThresholds = false;
            component.warningThresholdValue = 20;
            component.criticalThresholdValue = 30;

            component.ngOnInit();
            component.ngOnDestroy();
            const formSpy = spyOn(component.form, "markAllAsTouched");
            const cdSpy = spyOn((<any>component).cd, "detectChanges");
            component.form.get("criticalThresholdValue")?.setValue(19);
            expect(formSpy).not.toHaveBeenCalled();
            expect(cdSpy).not.toHaveBeenCalled();
        });
    });
});
