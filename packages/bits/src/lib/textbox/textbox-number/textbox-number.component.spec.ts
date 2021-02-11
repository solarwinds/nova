import { DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed } from "@angular/core/testing";
import { FormBuilder, FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

import { LoggerService } from "../../../services/log-service";
import { ButtonComponent } from "../../button/button.component";
import { IconComponent } from "../../icon/icon.component";
import { IconService } from "../../icon/icon.service";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { TooltipDirective } from "../../tooltip/tooltip.directive";

import { TextboxNumberComponent } from "./textbox-number.component";

describe("components >", () => {
    describe("textbox-number >", () => {
        // adding clipboardData to paste event
        const pasteEvent = new Event("paste");

        Object.defineProperty(pasteEvent, "clipboardData", {
            enumerable: true,
            writable: true,
            configurable: true,
            value: {
                getData: () => "test",
            },
        });

        let fixture: ComponentFixture<TextboxNumberComponent>;
        let testComponent: TextboxNumberComponent;

        let subject: TextboxNumberComponent;
        let debugElement: DebugElement;
        let inputControl: DebugElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    FormsModule,
                ],
                declarations: [
                    TextboxNumberComponent,
                    IconComponent,
                    SpinnerComponent,
                    ButtonComponent,
                    TooltipDirective,
                ],
                providers: [
                    FormBuilder,
                    LoggerService,
                    IconService,
                ],
            });
            fixture = TestBed.createComponent(TextboxNumberComponent);
            fixture.detectChanges();

            testComponent = fixture.componentInstance;
            subject = fixture.componentInstance;
            debugElement = fixture.debugElement;
            inputControl = debugElement.query(By.css(".input-control"));
        });

        describe("onValueChange > ", () => {
            it("keeps invalid input", () => {
                testComponent.onValueChange("yyy");
                expect(testComponent.value).toEqual("yyy");
            });
        });

        // TODO: Bring back in after NUI-5787
        xdescribe("input data  on inputText event", () => {
            it("should set valid input", () => {
                inputControl.nativeElement.value = "1";
                inputControl.nativeElement.dispatchEvent(new Event("keydown"));
                fixture.detectChanges();
                expect(inputControl.nativeElement.value).toEqual("1");
            });

            it("should not set invalid input on inputText event", () => {
                inputControl.nativeElement.value = "y";
                inputControl.nativeElement.dispatchEvent(new Event("keydown"));
                fixture.detectChanges();
                expect(inputControl.nativeElement.value).toEqual("");
            });
        });

        describe("input data  on paste event", () => {
            it("should paste valid data", () => {
                inputControl.nativeElement.value = "123456789.98";
                inputControl.nativeElement.dispatchEvent(pasteEvent);
                fixture.detectChanges();
                expect(inputControl.nativeElement.value).toEqual("123456789.98");
            });

            it("should not paste invalid data", () => {
                inputControl.nativeElement.value = "yy42tt45";
                inputControl.nativeElement.dispatchEvent(pasteEvent);
                fixture.detectChanges();
                expect(inputControl.nativeElement.value).toEqual("");
            });
        });

        describe("addNumber >", () => {
            beforeEach(() => {
                spyOn(subject, "writeValue");
                spyOn(subject, "onChange");
                spyOn(subject, "onTouched");
            });

            it("should increase value by given number", fakeAsync(() => {
                subject.value = 101;
                subject.addNumber(12);

                flush();

                expect(subject.onChange).toHaveBeenCalledWith(113);
            }));

            it("should decrease value", fakeAsync(() => {
                subject.value = 101;
                subject.addNumber(-12);

                flush();

                expect(subject.onChange).toHaveBeenCalledWith(89);
            }));

            it("should clamp the value to be within specified bounds",  fakeAsync(() => {
                subject.minValue = 0;
                subject.maxValue = 10;
                subject.value = 100;
                subject.addNumber(-1);

                flush();

                expect(subject.onChange).toHaveBeenCalledWith(10);
            }));

            it("should trigger onChange and onTouched", fakeAsync(() => {
                subject.value = 89;
                subject.addNumber(0);

                flush();

                expect(subject.onChange).toHaveBeenCalledWith(89);
                expect(subject.onTouched).toHaveBeenCalled();
            }));

            it("should floating point precision gone right", fakeAsync(() => {
                subject.value = 4.6;
                subject.addNumber(-1);

                flush();

                expect(subject.onChange).toHaveBeenCalledWith(3.6);
            }));

            it("should set initial value if not set before and increase it", fakeAsync(() => {
                subject.value = undefined;

                subject.addNumber(1);

                flush();

                expect(subject.onChange).toHaveBeenCalledWith(1);
            }));
        });

    });
});
