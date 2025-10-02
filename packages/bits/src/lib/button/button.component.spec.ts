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

import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    DebugElement,
    OnInit,
} from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { ButtonComponent } from "./button.component";
import { ButtonSizeType } from "./public-api";
import { buttonConstants } from "../../constants/button.constants";
import { LoggerService } from "../../services/log-service";

@Component({
    selector: "nui-button-on-button",
    template: ` <button nui-button type="button">Click me!</button> `,
    standalone: false,
})
class TestAppButtonComponent {}

@Component({
    selector: "nui-button-on-button-no-type",
    template: ` <button nui-button>Click me!</button> `,
    standalone: false,
})
class TestAppButtonNoTypeComponent {}

@Component({
    selector: "nui-button-on-div-no-type",
    template: ` <div nui-button>Click me!</div> `,
    standalone: false,
})
class TestAppButtonOnDivNoTypeComponent {}

@Component({
    selector: "nui-button-in-repeater",
    template: `
        <ul>
            <li *ngFor="let label of buttonLabels">
                <button nui-button type="button">{{ label }}</button>
            </li>
        </ul>
    `,
    standalone: false,
})
class TestAppButtonInRepeaterComponent implements OnInit {
    public buttonLabels: string[];
    public ngOnInit(): void {
        this.buttonLabels = ["testText", "testText"];
    }
}

@Component({
    selector: "nui-button-icon-only",
    template: ` <button nui-button type="button" icon="add"></button> `,
    standalone: false,
})
class TestAppIconOnlyButtonComponent {}

@Component({
    selector: "nui-button-icon-only-with-aria",
    template: ` <button nui-button type="button" icon="add" ariaLabel="Add item"></button> `,
    standalone: false,
})
class TestAppIconOnlyButtonWithAriaComponent {}

@Component({
    selector: "nui-button-busy",
    template: ` <button nui-button type="button" [isBusy]="isBusy">Loading</button> `,
    standalone: false,
})
class TestAppBusyButtonComponent {
    public isBusy = false;
}

@Component({
    selector: "nui-button-disabled",
    template: ` <button nui-button type="button" [disabled]="disabled">Click me</button> `,
    standalone: false,
})
class TestAppDisabledButtonComponent {
    public disabled = false;
}

@Component({
    selector: "nui-button-repeat-keyboard",
    template: ` <button nui-button type="button" [isRepeat]="true">Repeat button</button> `,
    standalone: false,
})
class TestAppRepeatKeyboardButtonComponent {}

describe("components >", () => {
    describe("button >", () => {
        const SIZE_LARGE = ButtonSizeType.large;

        let fixture: ComponentFixture<TestAppButtonComponent>;
        let subject: ButtonComponent;
        let de: DebugElement;
        let logger: LoggerService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ButtonComponent,
                    TestAppButtonNoTypeComponent,
                    TestAppButtonOnDivNoTypeComponent,
                    TestAppButtonInRepeaterComponent,
                    TestAppButtonComponent,
                    TestAppIconOnlyButtonComponent,
                    TestAppIconOnlyButtonWithAriaComponent,
                    TestAppBusyButtonComponent,
                    TestAppDisabledButtonComponent,
                    TestAppRepeatKeyboardButtonComponent,
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [LoggerService],
            });
            logger = TestBed.inject(LoggerService);
        });

        describe("input handling logic >", () => {
            beforeEach(() => {
                fixture = TestBed.createComponent(TestAppButtonComponent);
                de = fixture.debugElement;
                subject = de.children[0].componentInstance;
                fixture.detectChanges();
            });
            it("should remap 'iconSize' prop depending on 'size' prop value", () => {
                subject.size = SIZE_LARGE;
                expect(subject.getIconSize()).toEqual(
                    "",
                    "size:" + SIZE_LARGE + " -> empty string"
                );
                subject.size = ButtonSizeType.default;
                expect(subject.getIconSize()).toEqual(
                    "",
                    "size: empty -> empty string"
                );
            });

            it(`should map 'iconColor' to '' if iconColor is not set`, () => {
                expect(subject.iconColor).toEqual("");
            });
        });

        describe("logging >", () => {
            beforeEach(() => {
                logger = TestBed.inject(LoggerService);
            });
            it(`should log an error for buttons without a type attribute`, () => {
                const errorSpy = spyOnProperty(
                    logger,
                    "error",
                    "get"
                ).and.callThrough();
                fixture = TestBed.createComponent(TestAppButtonNoTypeComponent);
                expect(errorSpy).toHaveBeenCalled();
            });
            it(`should not log an error for non-buttons without a type attribute`, () => {
                const errorSpy = spyOnProperty(
                    logger,
                    "error",
                    "get"
                ).and.callThrough();
                fixture = TestBed.createComponent(
                    TestAppButtonOnDivNoTypeComponent
                );
                expect(errorSpy).not.toHaveBeenCalled();
            });
            it(`should not log an error for buttons with a type attribute`, () => {
                const errorSpy = spyOnProperty(
                    logger,
                    "error",
                    "get"
                ).and.callThrough();
                fixture = TestBed.createComponent(TestAppButtonComponent);
                expect(errorSpy).not.toHaveBeenCalled();
            });
        });

        describe("inside repeater >", () => {
            beforeEach(() => {
                de = TestBed.createComponent(
                    TestAppButtonInRepeaterComponent
                ).debugElement;
            });
            it(`should have text content`, () => {
                de.queryAll(By.css(".nui-button__content")).forEach(
                    (debugElement) => {
                        expect(debugElement.nativeElement.textContent).toEqual(
                            "testText"
                        );
                    }
                );
            });
        });

        describe("repeatable >", () => {
            let buttonFixture: ComponentFixture<ButtonComponent>;
            let element: HTMLButtonElement;

            beforeEach(() => {
                buttonFixture = TestBed.createComponent(ButtonComponent);
                subject = buttonFixture.componentInstance;
                subject.isRepeat = true;
                buttonFixture.detectChanges();

                element = (<any>subject).el.nativeElement;
            });

            it("stops emitting click after element becomes disabled", fakeAsync(() => {
                const click = spyOn(element, "click").and.callThrough();

                expect(click).not.toHaveBeenCalled();
                element.dispatchEvent(new MouseEvent("mousedown"));

                expect(click).toHaveBeenCalledTimes(0);

                tick(buttonConstants.repeatDelay);
                expect(click).toHaveBeenCalledTimes(1);

                tick(buttonConstants.repeatInterval);
                expect(click).toHaveBeenCalledTimes(2);

                element.disabled = true;
                tick(buttonConstants.repeatInterval);
                expect(click).toHaveBeenCalledTimes(2);
            }));
        });

        describe("accessibility >", () => {
            describe("icon-only buttons >", () => {
                it("should warn when icon-only button lacks aria-label", () => {
                    const warnSpy = spyOnProperty(logger, "warn", "get").and.callThrough();
                    fixture = TestBed.createComponent(TestAppIconOnlyButtonComponent);
                    de = fixture.debugElement;
                    subject = de.children[0].componentInstance;
                    subject.icon = "add";
                    subject.isEmpty = true;
                    fixture.detectChanges();

                    expect(warnSpy).toHaveBeenCalledWith(
                        "Icon-only button detected without aria-label. Please provide a meaningful aria-label for accessibility.",
                        jasmine.any(Object)
                    );
                });

                it("should not warn when icon-only button has aria-label", () => {
                    const warnSpy = spyOnProperty(logger, "warn", "get").and.callThrough();
                    fixture = TestBed.createComponent(TestAppIconOnlyButtonWithAriaComponent);
                    de = fixture.debugElement;
                    subject = de.children[0].componentInstance;
                    fixture.detectChanges();

                    expect(warnSpy).not.toHaveBeenCalled();
                });

                it("should use provided aria-label for icon-only buttons", () => {
                    fixture = TestBed.createComponent(TestAppIconOnlyButtonWithAriaComponent);
                    de = fixture.debugElement;
                    subject = de.children[0].componentInstance;
                    fixture.detectChanges();

                    expect(subject.ariaIconLabel).toBe("Add item");
                });
            });

            describe("busy state >", () => {
                let busyFixture: ComponentFixture<TestAppBusyButtonComponent>;
                let busyComponent: TestAppBusyButtonComponent;

                beforeEach(() => {
                    busyFixture = TestBed.createComponent(TestAppBusyButtonComponent);
                    busyComponent = busyFixture.componentInstance;
                    busyFixture.detectChanges();
                });

                it("should add aria-live and aria-atomic to busy container", () => {
                    busyComponent.isBusy = true;
                    busyFixture.detectChanges();

                    const rippleContainer = busyFixture.debugElement.query(
                        By.css(".nui-button-ripple-container")
                    );
                    expect(rippleContainer).toBeTruthy();
                    expect(rippleContainer.nativeElement.getAttribute("aria-live")).toBe("polite");
                    expect(rippleContainer.nativeElement.getAttribute("aria-atomic")).toBe("true");
                    expect(rippleContainer.nativeElement.getAttribute("aria-label")).toBe("Loading");
                });

                it("should not show ripple container when not busy", () => {
                    busyComponent.isBusy = false;
                    busyFixture.detectChanges();

                    const rippleContainer = busyFixture.debugElement.query(
                        By.css(".nui-button-ripple-container")
                    );
                    expect(rippleContainer).toBeFalsy();
                });

                it("should set aria-busy attribute based on isBusy state", () => {
                    const buttonElement = busyFixture.debugElement.query(By.css("button"));
                    
                    // Test busy state
                    busyComponent.isBusy = true;
                    busyFixture.detectChanges();
                    expect(buttonElement.nativeElement.getAttribute("aria-busy")).toBe("true");
                    
                    // Test non-busy state  
                    busyComponent.isBusy = false;
                    busyFixture.detectChanges();
                    expect(buttonElement.nativeElement.hasAttribute("aria-busy")).toBeFalsy();
                });
            });

            describe("disabled state >", () => {
                let disabledFixture: ComponentFixture<TestAppDisabledButtonComponent>;
                let disabledComponent: TestAppDisabledButtonComponent;
                let disabledSubject: ButtonComponent;

                beforeEach(() => {
                    disabledFixture = TestBed.createComponent(TestAppDisabledButtonComponent);
                    disabledComponent = disabledFixture.componentInstance;
                    disabledSubject = disabledFixture.debugElement.children[0].componentInstance;
                    disabledFixture.detectChanges();
                });

                it("should set aria-disabled to true when button is disabled", () => {
                    disabledComponent.disabled = true;
                    disabledFixture.detectChanges();
                    
                    const buttonElement = disabledFixture.debugElement.query(By.css("button")).nativeElement;
                    buttonElement.disabled = true; // Simulate disabled state
                    
                    expect(disabledSubject.ariaDisabled).toBe("true");
                });

                it("should not set aria-disabled when button is enabled", () => {
                    disabledComponent.disabled = false;
                    disabledFixture.detectChanges();
                    
                    expect(disabledSubject.ariaDisabled).toBeNull();
                });
            });

            describe("keyboard repeat functionality >", () => {
                let keyboardFixture: ComponentFixture<TestAppRepeatKeyboardButtonComponent>;
                let keyboardSubject: ButtonComponent;
                let element: HTMLButtonElement;

                beforeEach(() => {
                    keyboardFixture = TestBed.createComponent(TestAppRepeatKeyboardButtonComponent);
                    keyboardSubject = keyboardFixture.debugElement.children[0].componentInstance;
                    keyboardFixture.detectChanges();
                    element = (<any>keyboardSubject).el.nativeElement;
                });

                it("should trigger repeat functionality with Space key", fakeAsync(() => {
                    const click = spyOn(element, "click").and.callThrough();
                    
                    // Simulate keydown event
                    const keydownEvent = new KeyboardEvent("keydown", { code: "Space" });
                    Object.defineProperty(keydownEvent, 'preventDefault', { value: jasmine.createSpy() });
                    element.dispatchEvent(keydownEvent);

                    expect(click).toHaveBeenCalledTimes(0);

                    tick(buttonConstants.repeatDelay);
                    expect(click).toHaveBeenCalledTimes(1);

                    tick(buttonConstants.repeatInterval);
                    expect(click).toHaveBeenCalledTimes(2);

                    // Stop repeat with keyup
                    element.dispatchEvent(new KeyboardEvent("keyup", { code: "Space" }));
                    tick(buttonConstants.repeatInterval);
                    expect(click).toHaveBeenCalledTimes(2); // Should not increase
                }));

                it("should trigger repeat functionality with Enter key", fakeAsync(() => {
                    const click = spyOn(element, "click").and.callThrough();
                    
                    // Simulate keydown event
                    element.dispatchEvent(new KeyboardEvent("keydown", { code: "Enter" }));

                    expect(click).toHaveBeenCalledTimes(0);

                    tick(buttonConstants.repeatDelay);
                    expect(click).toHaveBeenCalledTimes(1);

                    tick(buttonConstants.repeatInterval);
                    expect(click).toHaveBeenCalledTimes(2);

                    // Stop repeat with keyup
                    element.dispatchEvent(new KeyboardEvent("keyup", { code: "Enter" }));
                    tick(buttonConstants.repeatInterval);
                    expect(click).toHaveBeenCalledTimes(2); // Should not increase
                }));

                it("should prevent default behavior for Space key", () => {
                    const keydownEvent = new KeyboardEvent("keydown", { code: "Space" });
                    const preventDefaultSpy = spyOn(keydownEvent, 'preventDefault');
                    
                    element.dispatchEvent(keydownEvent);
                    
                    expect(preventDefaultSpy).toHaveBeenCalled();
                });

                it("should not prevent default behavior for Enter key", () => {
                    const keydownEvent = new KeyboardEvent("keydown", { code: "Enter" });
                    const preventDefaultSpy = spyOn(keydownEvent, 'preventDefault');
                    
                    element.dispatchEvent(keydownEvent);
                    
                    expect(preventDefaultSpy).not.toHaveBeenCalled();
                });

                it("should ignore non-Space/Enter keys", fakeAsync(() => {
                    const click = spyOn(element, "click").and.callThrough();
                    
                    // Simulate keydown event with different key
                    element.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyA" }));

                    tick(buttonConstants.repeatDelay + buttonConstants.repeatInterval);
                    expect(click).not.toHaveBeenCalled();
                }));
            });
        });
    });
});
