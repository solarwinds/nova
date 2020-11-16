import { ChangeDetectorRef } from "@angular/core";
import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SwitchComponent } from "./switch.component";

describe("components >", () => {
    describe("switch >", () => {
        let switchFixture: ComponentFixture<SwitchComponent>;
        let nuiSwitch: SwitchComponent;
        let valueChange: Spy;
        let touched: Spy;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    SwitchComponent,
                ],
                providers: [ChangeDetectorRef],
            });

            switchFixture = TestBed.createComponent(SwitchComponent);
            nuiSwitch = switchFixture.componentInstance;

            valueChange = createSpy("valueChange");
            nuiSwitch.valueChange.subscribe(valueChange);
            touched = createSpy("touched");
            nuiSwitch.registerOnTouched(touched);
        });

        describe("toggle >", () => {
            it("should toggle", () => {
                nuiSwitch.value = true;

                nuiSwitch.toggle();
                expect(valueChange).toHaveBeenCalledWith(false);
                expect(touched).toHaveBeenCalledTimes(1);

                nuiSwitch.value = false;
                nuiSwitch.toggle();
                expect(valueChange).toHaveBeenCalledWith(true);
                expect(touched).toHaveBeenCalledTimes(2);
            });

            it("should not toggle when inactive", () => {
                nuiSwitch.value = true;
                nuiSwitch.setDisabledState(true);

                nuiSwitch.toggle();
                expect(valueChange).not.toHaveBeenCalled();
                expect(touched).not.toHaveBeenCalled();
            });
        });
    });
});
