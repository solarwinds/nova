import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";

import { ThresholdsConfigurationComponent } from "./thresholds-configuration.component";
import { thresholdsValidator } from "./thresholds-validator";

describe("ThresholdsConfigurationComponent > ", () => {
    let component: ThresholdsConfigurationComponent;
    let fixture: ComponentFixture<ThresholdsConfigurationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
            ],
        })
            .compileComponents();
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
