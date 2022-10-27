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

import { KEYBOARD_CODE } from "../../constants";
import { MenuPopupComponent } from "../menu";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";
import { TimePickerKeyboardService } from "./time-picker-keyboard.service";

const popupMock = {
    menuItems: {
        toArray: () => [] as any,
    },
} as MenuPopupComponent;

const overlayMock = {
    showing: false,
    show: () => {},
} as OverlayComponent;

const menuTriggerMock = {} as HTMLElement;

const keyBoardEventFactory = (code: KEYBOARD_CODE): KeyboardEvent =>
    ({
        preventDefault: () => {},
        code,
    } as KeyboardEvent);

describe("Services >", () => {
    describe("TimePickerKeyboardService", () => {
        const service = new TimePickerKeyboardService();

        beforeEach(() => {
            service.initService(popupMock, overlayMock, menuTriggerMock);
        });

        describe("onKeyDown", () => {
            afterAll(() => {
                (overlayMock as any).showing = false;
            });

            it("should call 'handleClosedMenu' if overlay not showing", () => {
                const spy = spyOn(service, "handleClosedMenu" as never);
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN);

                service.onKeyDown(event);
                expect(spy).toHaveBeenCalledWith(event as never);
            });

            it("should call 'handleOpenedMenu' if overlay not showing", () => {
                const spy = spyOn(service, "handleOpenedMenu" as never);
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN);
                (overlayMock as any).showing = true;

                service.onKeyDown(event);
                expect(spy).toHaveBeenCalledWith(event as never);
            });
        });

        describe("handleOpenedMenu", () => {
            it("should call 'hideMenu' on ESCAPE button", () => {
                const spy = spyOn(service, "hideMenu" as never);
                const event = keyBoardEventFactory(KEYBOARD_CODE.ESCAPE);

                service["handleOpenedMenu"](event);
                expect(spy).toHaveBeenCalled();
            });

            it("should call 'navigateByArrow' on DOWN and UP arrow buttons", () => {
                const spy = spyOn(service, "navigateByArrow" as never);
                const pressDown = keyBoardEventFactory(
                    KEYBOARD_CODE.ARROW_DOWN
                );
                const pressUp = keyBoardEventFactory(KEYBOARD_CODE.ARROW_UP);

                service["handleOpenedMenu"](pressDown);
                expect(spy).toHaveBeenCalledWith(pressDown as never);

                service["handleOpenedMenu"](pressUp);
                expect(spy).toHaveBeenCalledWith(pressUp as never);
            });

            it("should call event.preventDefault on Enter button", () => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.ENTER);
                const spy = spyOn(event, "preventDefault" as never);

                service["handleOpenedMenu"](event);
                expect(spy).toHaveBeenCalled();
            });

            it("should call doAction on press ENTER button", () => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.ENTER);
                const activeItem = { doAction: (even: any) => {} };
                const spy = spyOn(activeItem, "doAction");

                spyOnProperty(
                    service["keyboardEventsManager"],
                    "activeItem"
                ).and.returnValue(activeItem);

                service["handleOpenedMenu"](event);
                expect(spy).toHaveBeenCalled();
            });
        });

        describe("handleClosedMenu", () => {
            it("should call 'event.PreventDefault on press arrowDown key", () => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN);
                const spy = spyOn(event, "preventDefault");

                service["handleClosedMenu"](event);
                expect(spy).toHaveBeenCalled();
            });

            it("should call 'overlay.show() on press arrowDown key", () => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN);
                const spy = spyOn(overlayMock, "show");

                service["handleClosedMenu"](event);
                expect(spy).toHaveBeenCalled();
            });

            it("should scrollIntoView on press arrowDown key", () => {
                const activeItem = {
                    menuItem: {
                        nativeElement: {
                            scrollIntoView: (event: any) => {},
                        },
                    },
                };
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN);
                const spy = spyOn(
                    activeItem.menuItem.nativeElement,
                    "scrollIntoView"
                );

                spyOn(
                    service["keyboardEventsManager"],
                    "setActiveItem" as never
                );
                spyOnProperty(
                    service["keyboardEventsManager"],
                    "activeItem"
                ).and.returnValue(activeItem);
                service["handleClosedMenu"](event);
                expect(spy).toHaveBeenCalledWith({ block: "center" });
            });
        });

        describe("navigateByArrow", () => {
            it("should call preventDefault", () => {
                const pressDown = keyBoardEventFactory(
                    KEYBOARD_CODE.ARROW_DOWN
                );
                const spy = spyOn(pressDown, "preventDefault" as never);

                service["navigateByArrow"](pressDown);
                expect(spy).toHaveBeenCalled();
            });

            it("should call navigateOnLast on press arrowUp and if index = 0", () => {
                const pressUp = keyBoardEventFactory(KEYBOARD_CODE.ARROW_UP);
                const spy = spyOn(service, "navigateOnLast" as never);
                spyOnProperty(
                    service["keyboardEventsManager"],
                    "activeItemIndex"
                ).and.returnValue(0);

                service["navigateByArrow"](pressUp);
                expect(spy).toHaveBeenCalled();
            });

            it("should call navigateOnFirst on press arrowDown if index on last item", () => {
                const pressDown = keyBoardEventFactory(
                    KEYBOARD_CODE.ARROW_DOWN
                );
                const spy = spyOn(service, "navigateOnFirst" as never);
                spyOnProperty(
                    service["keyboardEventsManager"],
                    "activeItemIndex"
                ).and.returnValue(0);

                service["navigateByArrow"](pressDown);
                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
