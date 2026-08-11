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

import { ElementRef } from "@angular/core";

import {
    SelectV2ActionBaseDirective,
    SelectV2GroupActionDirective,
    SelectV2OptionActionDirective,
} from "./select-v2-actions.directive";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";
import { IOptionedComponent } from "./types";

describe("directives >", () => {
    const cases: {
        name: string;
        Ctor: new (
            elRef: ElementRef<HTMLElement>,
            parent: IOptionedComponent
        ) => SelectV2ActionBaseDirective;
        entryKey: string;
        otherArrows: string[];
    }[] = [
        {
            name: "SelectV2OptionActionDirective",
            Ctor: SelectV2OptionActionDirective,
            entryKey: KEYBOARD_CODE.ARROW_RIGHT,
            otherArrows: [
                KEYBOARD_CODE.ARROW_LEFT,
                KEYBOARD_CODE.ARROW_UP,
                KEYBOARD_CODE.ARROW_DOWN,
            ],
        },
        {
            name: "SelectV2GroupActionDirective",
            Ctor: SelectV2GroupActionDirective,
            entryKey: KEYBOARD_CODE.ARROW_UP,
            otherArrows: [
                KEYBOARD_CODE.ARROW_LEFT,
                KEYBOARD_CODE.ARROW_RIGHT,
                KEYBOARD_CODE.ARROW_DOWN,
            ],
        },
    ];

    cases.forEach(({ name, Ctor, entryKey, otherArrows }) => {
        describe(name, () => {
            let directive: SelectV2ActionBaseDirective;
            let nativeElement: jasmine.SpyObj<HTMLElement>;
            let parent: jasmine.SpyObj<IOptionedComponent>;

            const buildEvent = (code?: string) =>
                jasmine.createSpyObj(
                    "event",
                    ["stopPropagation", "preventDefault"],
                    { code }
                );

            beforeEach(() => {
                nativeElement = jasmine.createSpyObj("nativeElement", ["focus"]);
                parent = jasmine.createSpyObj("parent", [
                    "focusTrigger",
                    "hideDropdown",
                ]);
                directive = new Ctor(
                    { nativeElement } as ElementRef<HTMLElement>,
                    parent
                );
            });

            it("should focus the host element", () => {
                directive.focus();
                expect(nativeElement.focus).toHaveBeenCalled();
            });

            it("should stop keydown propagation to the option key manager", () => {
                const event = buildEvent(KEYBOARD_CODE.ENTER);
                directive.onKeydown(event);
                expect(event.stopPropagation).toHaveBeenCalled();
            });

            it("should return focus to the trigger on Escape", () => {
                const event = buildEvent(KEYBOARD_CODE.ESCAPE);
                directive.onKeydown(event);
                expect(event.preventDefault).toHaveBeenCalled();
                expect(parent.focusTrigger).toHaveBeenCalled();
            });

            // The entry key itself must not return (it would immediately pop back out).
            otherArrows.forEach((code) => {
                it(`should return focus to the trigger and prevent page scroll on ${code}`, () => {
                    const event = buildEvent(code);
                    directive.onKeydown(event);
                    expect(event.preventDefault).toHaveBeenCalled();
                    expect(parent.focusTrigger).toHaveBeenCalled();
                });
            });

            it(`should do nothing on ${entryKey} (entry key) but still prevent page scroll`, () => {
                const event = buildEvent(entryKey);
                directive.onKeydown(event);
                expect(event.preventDefault).toHaveBeenCalled();
                expect(parent.focusTrigger).not.toHaveBeenCalled();
            });

            it("should not return focus to the trigger on other keys", () => {
                const event = buildEvent(KEYBOARD_CODE.ENTER);
                directive.onKeydown(event);
                expect(parent.focusTrigger).not.toHaveBeenCalled();
            });

            it("should stop click propagation so the parent is not selected/closed", () => {
                const event = buildEvent();
                directive.onClick(event as unknown as MouseEvent);
                expect(event.stopPropagation).toHaveBeenCalled();
            });

            it("should close the dropdown and refocus the trigger on Tab, without preventing default", () => {
                const event = buildEvent(KEYBOARD_CODE.TAB);
                directive.onKeydown(event);
                expect(parent.hideDropdown).toHaveBeenCalled();
                expect(parent.focusTrigger).toHaveBeenCalled();
                expect(event.preventDefault).not.toHaveBeenCalled();
            });
        });
    });
});
