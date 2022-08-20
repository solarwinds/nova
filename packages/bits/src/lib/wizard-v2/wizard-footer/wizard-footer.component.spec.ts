import { WizardFooterComponent } from "./wizard-footer.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("components >", () => {
    describe("WizardFooterComponent", () => {
        let component: WizardFooterComponent;
        let fixture: ComponentFixture<WizardFooterComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [WizardFooterComponent],
            });

            fixture = TestBed.createComponent(WizardFooterComponent);
            component = fixture.componentInstance;
        });

        describe("ngAfterViewInit", () => {
            it("should call focusMonitor 'monitor' method", () => {
                const spy = spyOn(component["_focusMonitor"], "monitor");

                component.ngAfterViewInit();
                expect(spy).toHaveBeenCalledWith(
                    component["_elementRef"],
                    true
                );
            });
        });

        describe("ngOnDestroy", () => {
            it("should call focusMonitor 'stopMonitoring' method", () => {
                const spy = spyOn(component["_focusMonitor"], "stopMonitoring");

                component.ngOnDestroy();
                expect(spy).toHaveBeenCalledWith(component["_elementRef"]);
            });
        });

        describe("focus", () => {
            it("should call focusMonitor 'focusVia' method", () => {
                const spy = spyOn(component["_focusMonitor"], "focusVia");

                component.focus();
                expect(spy).toHaveBeenCalledWith(
                    component["_elementRef"],
                    "program"
                );
            });
        });
    });
});
