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

import { buttonConstants } from "../../constants/button.constants";
import { LoggerService } from "../../services/log-service";
import { ButtonComponent } from "./button.component";
import { ButtonSizeType } from "./public-api";

@Component({
    selector: "nui-button-on-button",
    template: ` <button nui-button type="button">Click me!</button> `,
})
class TestAppButtonComponent {}

@Component({
    selector: "nui-button-on-button-no-type",
    template: ` <button nui-button>Click me!</button> `,
})
class TestAppButtonNoTypeComponent {}

@Component({
    selector: "nui-button-on-div-no-type",
    template: ` <div nui-button>Click me!</div> `,
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
})
class TestAppButtonInRepeaterComponent implements OnInit {
    public buttonLabels: string[];
    ngOnInit() {
        this.buttonLabels = ["testText", "testText"];
    }
}

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
    });
});
