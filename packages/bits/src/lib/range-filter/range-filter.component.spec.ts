import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { RangeFilterComponent } from "./range-filter.component";
import { RangeValue } from "./range-filter.models";

describe("components >", () => {
    describe("range filter >", () => {
        let fixture: ComponentFixture<RangeFilterComponent>;
        let component: RangeFilterComponent;

        const setInputs = (
            overrides: Partial<{
                min: number;
                max: number;
                valueLow: number;
                valueHigh: number;
                step: number;
                mode: "range" | "single";
                disabled: boolean;
                showInputs: boolean;
                debounceMs: number;
            }>
        ): void => {
            if (overrides.min !== undefined) {
                fixture.componentRef.setInput("min", overrides.min);
            }
            if (overrides.max !== undefined) {
                fixture.componentRef.setInput("max", overrides.max);
            }
            if (overrides.valueLow !== undefined) {
                fixture.componentRef.setInput("valueLow", overrides.valueLow);
            }
            if (overrides.valueHigh !== undefined) {
                fixture.componentRef.setInput("valueHigh", overrides.valueHigh);
            }
            if (overrides.step !== undefined) {
                fixture.componentRef.setInput("step", overrides.step);
            }
            if (overrides.mode !== undefined) {
                fixture.componentRef.setInput("mode", overrides.mode);
            }
            if (overrides.disabled !== undefined) {
                fixture.componentRef.setInput("disabled", overrides.disabled);
            }
            if (overrides.showInputs !== undefined) {
                fixture.componentRef.setInput(
                    "showInputs",
                    overrides.showInputs
                );
            }
            if (overrides.debounceMs !== undefined) {
                fixture.componentRef.setInput(
                    "debounceMs",
                    overrides.debounceMs
                );
            }
            fixture.detectChanges();
        };

        const getHighHandle = () =>
            (fixture.debugElement.query(
                By.css(".nui-range-filter__handle--high")
            )?.nativeElement as HTMLElement | undefined) ?? null;

        const getLowHandle = () =>
            (fixture.debugElement.query(
                By.css(".nui-range-filter__handle--low")
            )?.nativeElement as HTMLElement | undefined) ?? null;

        const getInputs = () =>
            fixture.debugElement
                .queryAll(
                    By.css(".nui-range-filter__input-group .nui-textbox__input")
                )
                .map(({ nativeElement }) => nativeElement as HTMLInputElement);

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [RangeFilterComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(RangeFilterComponent);
            component = fixture.componentInstance;
            fixture.componentRef.setInput("debounceMs", 0);
            fixture.detectChanges();
        });

        it("renders one handle in single mode", () => {
            setInputs({ mode: "single" });

            expect(getLowHandle()).toBeNull();
            expect(getHighHandle()).toBeTruthy();
        });

        it("renders two handles in range mode", () => {
            setInputs({ mode: "range" });

            expect(getLowHandle()).toBeTruthy();
            expect(getHighHandle()).toBeTruthy();
        });

        it("renders inputs when showInputs is true", () => {
            setInputs({ showInputs: true, mode: "range" });

            expect(getInputs().length).toBe(2);
        });

        it("hides inputs when showInputs is false", () => {
            setInputs({ showInputs: false });

            expect(getInputs().length).toBe(0);
        });

        it("renders one input in single mode", () => {
            setInputs({ showInputs: true, mode: "single" });

            expect(getInputs().length).toBe(1);
        });

        it("marks component disabled when disabled input is true", () => {
            setInputs({ disabled: true });

            expect(
                fixture.debugElement.query(
                    By.css(".nui-range-filter--disabled")
                )
            ).toBeTruthy();
        });

        it("marks component disabled when min equals max", () => {
            setInputs({ min: 50, max: 50 });

            expect(
                fixture.debugElement.query(
                    By.css(".nui-range-filter--disabled")
                )
            ).toBeTruthy();
        });

        it("sets handles to tabindex -1 when disabled", () => {
            setInputs({ disabled: true, mode: "range" });

            expect(getHighHandle()?.getAttribute("tabindex")).toBe("-1");
            expect(getLowHandle()?.getAttribute("tabindex")).toBe("-1");
        });

        it("clamps displayLow to min when valueLow is below min", () => {
            setInputs({ min: 10, max: 100, valueLow: 0, valueHigh: 80 });

            expect(component["displayLow"]()).toBe(10);
        });

        it("clamps displayHigh to max when valueHigh exceeds max", () => {
            setInputs({ min: 0, max: 100, valueLow: 20, valueHigh: 150 });

            expect(component["displayHigh"]()).toBe(100);
        });

        it("clamps displayLow to valueHigh when valueLow exceeds valueHigh", () => {
            setInputs({ min: 0, max: 100, valueLow: 90, valueHigh: 50 });

            expect(component["displayLow"]()).toBe(50);
        });

        it("snaps displayHigh to nearest step", () => {
            setInputs({ min: 0, max: 100, valueHigh: 13, step: 5 });

            expect(component["displayHigh"]()).toBe(15);
        });

        it("snaps displayLow to nearest step", () => {
            setInputs({
                min: 0,
                max: 100,
                valueLow: 12,
                valueHigh: 80,
                step: 5,
            });

            expect(component["displayLow"]()).toBe(10);
        });

        it("emits rangeChange immediately when debounceMs is 0", (done) => {
            setInputs({
                min: 0,
                max: 100,
                valueLow: 20,
                valueHigh: 80,
                debounceMs: 0,
            });

            component.rangeChange.subscribe((value: RangeValue) => {
                expect(value.high).toBe(79);
                done();
            });

            getHighHandle()?.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowLeft",
                    bubbles: true,
                })
            );
        });

        it("does not emit rangeChange when disabled", () => {
            setInputs({ disabled: true, debounceMs: 0 });
            const spy = jasmine.createSpy("rangeChange");

            component.rangeChange.subscribe(spy);
            getHighHandle()?.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowLeft",
                    bubbles: true,
                })
            );

            expect(spy).not.toHaveBeenCalled();
        });

        it("increments high value on ArrowRight", (done) => {
            setInputs({
                min: 0,
                max: 100,
                valueLow: 20,
                valueHigh: 50,
                step: 1,
                debounceMs: 0,
            });

            component.rangeChange.subscribe((value: RangeValue) => {
                expect(value.high).toBe(51);
                done();
            });

            getHighHandle()?.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowRight",
                    bubbles: true,
                })
            );
        });

        it("decrements low value on ArrowLeft", (done) => {
            setInputs({
                min: 0,
                max: 100,
                valueLow: 30,
                valueHigh: 70,
                step: 1,
                mode: "range",
                debounceMs: 0,
            });

            component.rangeChange.subscribe((value: RangeValue) => {
                expect(value.low).toBe(29);
                done();
            });

            getLowHandle()?.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowLeft",
                    bubbles: true,
                })
            );
        });

        it("moves high to max on End key", (done) => {
            setInputs({ min: 0, max: 100, valueHigh: 50, debounceMs: 0 });

            component.rangeChange.subscribe((value: RangeValue) => {
                expect(value.high).toBe(100);
                done();
            });

            getHighHandle()?.dispatchEvent(
                new KeyboardEvent("keydown", { key: "End", bubbles: true })
            );
        });

        it("moves high to min floor on Home key", (done) => {
            setInputs({
                min: 0,
                max: 100,
                valueLow: 20,
                valueHigh: 50,
                mode: "range",
                debounceMs: 0,
            });

            component.rangeChange.subscribe((value: RangeValue) => {
                expect(value.high).toBe(20);
                done();
            });

            getHighHandle()?.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Home", bubbles: true })
            );
        });

        it("moves by large step on Shift+Arrow", (done) => {
            setInputs({
                min: 0,
                max: 200,
                valueHigh: 50,
                step: 5,
                debounceMs: 0,
            });

            component.rangeChange.subscribe((value: RangeValue) => {
                expect(value.high).toBe(100);
                done();
            });

            getHighHandle()?.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowRight",
                    shiftKey: true,
                    bubbles: true,
                })
            );
        });

        it("emits low:min in single mode regardless of valueLow", (done) => {
            setInputs({
                min: 10,
                max: 100,
                valueLow: 40,
                valueHigh: 70,
                mode: "single",
                debounceMs: 0,
            });

            component.rangeChange.subscribe((value: RangeValue) => {
                expect(value.low).toBe(10);
                done();
            });

            getHighHandle()?.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowRight",
                    bubbles: true,
                })
            );
        });

        it("sets aria-valuemin, aria-valuemax, and aria-valuenow on the high handle", () => {
            setInputs({
                min: 0,
                max: 100,
                valueLow: 20,
                valueHigh: 60,
                mode: "range",
            });

            expect(getHighHandle()?.getAttribute("aria-valuemin")).toBe("20");
            expect(getHighHandle()?.getAttribute("aria-valuemax")).toBe("100");
            expect(getHighHandle()?.getAttribute("aria-valuenow")).toBe("60");
        });

        it("sets aria-valuemax on the low handle to displayHigh", () => {
            setInputs({
                min: 0,
                max: 100,
                valueLow: 20,
                valueHigh: 60,
                mode: "range",
            });

            expect(getLowHandle()?.getAttribute("aria-valuemax")).toBe("60");
            expect(getLowHandle()?.getAttribute("aria-valuenow")).toBe("20");
        });

        it("uses a unique label id for each instance", () => {
            const firstFixture = TestBed.createComponent(RangeFilterComponent);
            firstFixture.componentRef.setInput("label", "CPU usage");
            firstFixture.detectChanges();

            const secondFixture = TestBed.createComponent(RangeFilterComponent);
            secondFixture.componentRef.setInput("label", "Latency");
            secondFixture.detectChanges();

            const firstLabelId = (
                firstFixture.debugElement.query(
                    By.css(".nui-range-filter__label")
                ).nativeElement as HTMLElement
            ).id;
            const secondLabelId = (
                secondFixture.debugElement.query(
                    By.css(".nui-range-filter__label")
                ).nativeElement as HTMLElement
            ).id;

            expect(firstLabelId).not.toBe(secondLabelId);
            expect(
                firstFixture.debugElement
                    .query(By.css(".nui-range-filter__handle--high"))
                    .nativeElement.getAttribute("aria-labelledby")
            ).toBe(firstLabelId);
            expect(
                secondFixture.debugElement
                    .query(By.css(".nui-range-filter__handle--high"))
                    .nativeElement.getAttribute("aria-labelledby")
            ).toBe(secondLabelId);

            firstFixture.destroy();
            secondFixture.destroy();
        });
    });
});
