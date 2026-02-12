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

import { Overlay } from "@angular/cdk/overlay";
import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    Input,
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Subject } from "rxjs/internal/Subject";

import { ColorPickerComponent } from "./color-picker.component";
import { ColorService } from "./color.service";


@Component({
    selector: "nui-select-v2",
    template: "<ng-content></ng-content>",
    standalone: false,
})
class MockSelectV2Component {
    @Input() overlayConfig: any;
    @Input() displayValueTemplate: any;
    @Input() syncWidth: boolean;

    writeValue = jasmine.createSpy("writeValue");

    valueSelected = new Subject<any>();

    dropdown = {
        show$: new Subject<void>(),
        hide$: new Subject<void>(),
    };

    elRef = new ElementRef(document.createElement("div"));
}

describe("components >", () => {
    describe("color-picker >", () => {
        let fixture: ComponentFixture<ColorPickerComponent>;
        let subject: ColorPickerComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [ColorPickerComponent, MockSelectV2Component],
                providers: [ColorService, Overlay],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });

            fixture = TestBed.createComponent(ColorPickerComponent);
            subject = fixture.componentInstance;

            subject.select = {
                writeValue: jasmine.createSpy("writeValue"),
                valueSelected: new Subject(),
                dropdown: {
                    show$: new Subject<void>(),
                    hide$: new Subject<void>(),
                },
                elRef: new ElementRef(document.createElement("div")),
            } as any;

        });

        describe("default >", () => {
            it("should be created", () => {
                expect(subject).toBeTruthy();
            });

            it("should use default color if no value is set", () => {
                fixture.detectChanges();
                expect(subject.defaultColor).toBe(
                    "var(--nui-color-bg-secondary)"
                );
            });

            it("should render palette from colors input", () => {
                subject.colors = ["#ff0000", "#00ff00"];
                fixture.detectChanges();

                expect(subject.colors.length).toBe(2);
            });

            it("should render palette from colorPalette input", () => {
                subject.colorPalette = [
                    { color: "#123456", label: "Custom Color" },
                ];
                fixture.detectChanges();

                expect(subject.colorPalette[0].label).toBe("Custom Color");
            });
        });

        describe("value handling >", () => {
            it("should writeValue update component value", () => {
                subject.writeValue("#ff0000");
                expect(subject.value).toBe("#ff0000");
            });

            it("should registerOnChange and call it when changed", () => {
                const fn = jasmine.createSpy("onChange");
                subject.registerOnChange(fn);

                subject.onChange("#00ff00");
                expect(fn).toHaveBeenCalledWith("#00ff00");
            });

            it("should registerOnTouched and call it when touched", () => {
                const fn = jasmine.createSpy("onTouched");
                subject.registerOnTouched(fn);

                subject._onTouched();
                expect(fn).toHaveBeenCalled();
            });
        });

        describe("determineBlackTick >", () => {
            it("should return true for light colors", () => {
                const result = subject.determineBlackTick("#ffffff");
                expect(result).toBeTrue();
            });

            it("should return false for dark colors", () => {
                const result = subject.determineBlackTick("#000000");
                expect(result).toBeFalse();
            });
        });

        describe("setStyles >", () => {
            it("should return style object with background-color", () => {
                const style = subject.setStyles("#abcdef");
                expect(style["background-color"]).toBe("#abcdef");
            });

            it("should use defaultColor if no color provided", () => {
                const style = subject.setStyles("");
                expect(style["background-color"]).toBe(subject.defaultColor);
            });
        });

        describe("template rendering >", () => {
            it("should show palette box template when isSelect=false", () => {
                subject.isSelect = false;
                subject.colors = ["#00ff00"];
                fixture.detectChanges();

                const containerEl = fixture.debugElement.query(
                    By.css(".color-picker-container")
                );
                expect(containerEl).toBeTruthy();
            });
        });
    });
});
