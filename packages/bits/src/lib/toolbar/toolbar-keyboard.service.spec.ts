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

import { ToolbarKeyboardService } from "./toolbar-keyboard.service";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";

const keyboardEventMock: KeyboardEvent = {
    code: KEYBOARD_CODE.ARROW_LEFT,
    preventDefault: () => {},
} as KeyboardEvent;

function createTestDomElements(): void {
    const fragment = document.createDocumentFragment();
    const container = document.createElement("div");
    const dynamicContainer = document.createElement("div");

    container.id = "testContainer";
    dynamicContainer.classList.add("nui-toolbar-content__dynamic");

    for (let i = 1; i <= 3; i++) {
        const btn = document.createElement("button");
        btn.id = `button-${i}`;
        btn.classList.add("testButton");
        dynamicContainer.appendChild(btn);
    }

    container.appendChild(dynamicContainer);
    fragment.appendChild(container);
    document.body.appendChild(fragment);
}

describe("Services > ", () => {
    describe("ToolbarKeyboardService", () => {
        const service = new ToolbarKeyboardService();

        beforeAll(() => {
            createTestDomElements();
        });

        afterAll(() => {
            const container = document.getElementById("testContainer");

            (container as HTMLElement).remove();
        });

        beforeEach(() => {
            const buttons = document.querySelectorAll(".testButton");

            service.setToolbarItems(Array.from(buttons) as HTMLElement[]);
        });

        describe("onKeyDown", () => {
            const rightButtonPressEvent = {
                ...keyboardEventMock,
                ...{ code: KEYBOARD_CODE.ARROW_RIGHT },
            };

            it("should call preventDefault", () => {
                const spy = spyOn(keyboardEventMock, "preventDefault");

                service.onKeyDown(keyboardEventMock);
                expect(spy).toHaveBeenCalled();
            });

            it("should call navigateByArrow method", () => {
                const spy = spyOn(service as any, "navigateByArrow");
                const { code } = keyboardEventMock;

                service.onKeyDown(keyboardEventMock);
                expect(spy).toHaveBeenCalledWith(code);
            });

            it("should navigate to first if last element in focus on press right arrow button", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const last = items[items.length - 1];
                const spy = spyOn(first, "focus");

                last.focus();

                service.onKeyDown(rightButtonPressEvent);
                expect(spy).toHaveBeenCalled();
            });

            it("should navigate to last if firs element in focus on press left arrow button", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const last = items[items.length - 1];
                const spy = spyOn(last, "focus");

                first.focus();

                service.onKeyDown(keyboardEventMock);
                expect(spy).toHaveBeenCalled();
            });

            it("should move right on pressing right arrow button", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const next = items[1];
                const spy = spyOn(next, "focus");

                first.focus();

                service.onKeyDown(rightButtonPressEvent);
                expect(spy).toHaveBeenCalled();
            });

            it("should navigate to first element on pressing Home key", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const last = items[items.length - 1];
                const spy = spyOn(first, "focus");

                last.focus();

                service.onKeyDown({
                    ...keyboardEventMock,
                    code: KEYBOARD_CODE.HOME,
                } as KeyboardEvent);
                expect(spy).toHaveBeenCalled();
            });

            it("should navigate to last element on pressing End key", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const last = items[items.length - 1];
                const spy = spyOn(last, "focus");

                first.focus();

                service.onKeyDown({
                    ...keyboardEventMock,
                    code: KEYBOARD_CODE.END,
                } as KeyboardEvent);
                expect(spy).toHaveBeenCalled();
            });

            it("should leave Home, End and arrow keys to a text input", () => {
                const input = document.createElement("input");
                input.type = "text";
                document.body.appendChild(input);
                input.focus();
                input.addEventListener("keydown", event =>
                    service.onKeyDown(event)
                );
                const first = service["toolbarItems"][0];
                const focusSpy = spyOn(first, "focus");

                for (const code of [
                    KEYBOARD_CODE.HOME,
                    KEYBOARD_CODE.END,
                    KEYBOARD_CODE.ARROW_LEFT,
                ]) {
                    const event = new KeyboardEvent("keydown", {
                        code,
                        bubbles: true,
                        cancelable: true,
                    });
                    input.dispatchEvent(event);
                    expect(event.defaultPrevented).toBeFalse();
                }

                expect(focusSpy).not.toHaveBeenCalled();
                expect(document.activeElement).toBe(input);
                input.remove();
            });

            it("should leave Home and End to a nested contenteditable field", () => {
                const editor = document.createElement("div");
                editor.contentEditable = "true";
                const child = document.createElement("span");
                editor.appendChild(child);
                document.body.appendChild(editor);
                editor.addEventListener("keydown", event =>
                    service.onKeyDown(event)
                );

                for (const code of [KEYBOARD_CODE.HOME, KEYBOARD_CODE.END]) {
                    const event = new KeyboardEvent("keydown", {
                        code,
                        bubbles: true,
                        cancelable: true,
                    });
                    child.dispatchEvent(event);
                    expect(event.defaultPrevented).toBeFalse();
                }

                editor.remove();
            });

            describe("disabled items", () => {
                afterEach(() => {
                    const items = service["toolbarItems"];

                    items.forEach(item => item.removeAttribute("disabled"));
                });

                it("should skip a disabled item on pressing right arrow button", () => {
                    const items = service["toolbarItems"];
                    const [first, middle, last] = items;
                    const spy = spyOn(last, "focus");

                    middle.setAttribute("disabled", "true");
                    first.focus();

                    service.onKeyDown(rightButtonPressEvent);
                    expect(spy).toHaveBeenCalled();
                });

                it("should not focus a disabled item on pressing End key", () => {
                    const items = service["toolbarItems"];
                    const [first, middle, last] = items;
                    const spy = spyOn(middle, "focus");
                    const lastSpy = spyOn(last, "focus");

                    last.setAttribute("disabled", "true");
                    first.focus();

                    service.onKeyDown({
                        ...keyboardEventMock,
                        code: KEYBOARD_CODE.END,
                    } as KeyboardEvent);
                    expect(spy).toHaveBeenCalled();
                    expect(lastSpy).not.toHaveBeenCalled();
                });
            });
        });

        describe("onKeyDown with vertical orientation", () => {
            const downButtonPressEvent = {
                ...keyboardEventMock,
                code: KEYBOARD_CODE.ARROW_DOWN,
            } as KeyboardEvent;
            const upButtonPressEvent = {
                ...keyboardEventMock,
                code: KEYBOARD_CODE.ARROW_UP,
            } as KeyboardEvent;
            const rightButtonPressEvent = {
                ...keyboardEventMock,
                code: KEYBOARD_CODE.ARROW_RIGHT,
            } as KeyboardEvent;

            beforeEach(() => {
                const buttons = document.querySelectorAll(".testButton");

                service.setToolbarItems(
                    Array.from(buttons) as HTMLElement[],
                    undefined,
                    "vertical"
                );
            });

            it("should move to next item on pressing down arrow button", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const next = items[1];
                const spy = spyOn(next, "focus");

                first.focus();

                service.onKeyDown(downButtonPressEvent);
                expect(spy).toHaveBeenCalled();
            });

            it("should move to previous item on pressing up arrow button", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const middle = items[1];
                const spy = spyOn(first, "focus");

                middle.focus();

                service.onKeyDown(upButtonPressEvent);
                expect(spy).toHaveBeenCalled();
            });

            it("should wrap to last item on pressing up arrow button on first item", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const last = items[items.length - 1];
                const spy = spyOn(last, "focus");

                first.focus();

                service.onKeyDown(upButtonPressEvent);
                expect(spy).toHaveBeenCalled();
            });

            it("should not navigate on left/right arrow keys", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const next = items[1];
                const spy = spyOn(next, "focus");

                first.focus();

                service.onKeyDown(rightButtonPressEvent);
                expect(spy).not.toHaveBeenCalled();
            });

            it("should navigate to first element on pressing Home key", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const last = items[items.length - 1];
                const spy = spyOn(first, "focus");

                last.focus();

                service.onKeyDown({
                    ...keyboardEventMock,
                    code: KEYBOARD_CODE.HOME,
                } as KeyboardEvent);
                expect(spy).toHaveBeenCalled();
            });

            it("should navigate to last element on pressing End key", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const last = items[items.length - 1];
                const spy = spyOn(last, "focus");

                first.focus();

                service.onKeyDown({
                    ...keyboardEventMock,
                    code: KEYBOARD_CODE.END,
                } as KeyboardEvent);
                expect(spy).toHaveBeenCalled();
            });

            describe("disabled items", () => {
                afterEach(() => {
                    const items = service["toolbarItems"];

                    items.forEach(item => item.removeAttribute("disabled"));
                });

                it("should skip a disabled item on pressing down arrow button", () => {
                    const items = service["toolbarItems"];
                    const [first, middle, last] = items;
                    const spy = spyOn(last, "focus");

                    middle.setAttribute("disabled", "true");
                    first.focus();

                    service.onKeyDown(downButtonPressEvent);
                    expect(spy).toHaveBeenCalled();
                });

                it("should not focus a disabled item on pressing End key", () => {
                    const items = service["toolbarItems"];
                    const [first, middle, last] = items;
                    const spy = spyOn(middle, "focus");
                    const lastSpy = spyOn(last, "focus");

                    last.setAttribute("disabled", "true");
                    first.focus();

                    service.onKeyDown({
                        ...keyboardEventMock,
                        code: KEYBOARD_CODE.END,
                    } as KeyboardEvent);
                    expect(spy).toHaveBeenCalled();
                    expect(lastSpy).not.toHaveBeenCalled();
                });
            });
        });
    });
});
