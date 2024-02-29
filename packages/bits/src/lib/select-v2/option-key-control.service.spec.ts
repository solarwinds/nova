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

import { OptionKeyControlService } from "./option-key-control.service";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";

const popupMock = {
    showing: true,
    toggle: () => {},
};

const keyBoardEventMock = {
    target: { selectionStart: 0 },
    code: "",
    preventDefault: () => {},
};

const options = {
    first: {
        active: true,
        value: "Item 1",
    },
    last: {
        active: false,
        value: "Item 2",
    },
    length: 2,
};

describe("components > ", () => {
    const announcerMock = jasmine.createSpyObj("liveAnnouncer", ["announce"]);
    let service: OptionKeyControlService<any>;

    describe("combobox > OptionKeyControlService", () => {
        beforeEach(() => {
            service = new OptionKeyControlService<any>(announcerMock);
            service.popup = popupMock;
            service.optionItems = options as any;
            service.initKeyboardManager();
        });

        describe("handleKeydown", () => {
            it("should call 'handleOpenKeyDown' if popup showing = true", () => {
                const spy = spyOn(service, "handleOpenKeyDown" as any);

                service.handleKeydown(keyBoardEventMock as any);

                expect(spy).toHaveBeenCalledWith(keyBoardEventMock);
            });

            it("should call 'scrollToActiveItem' if popup showing = true", () => {
                const spy = spyOn(service, "scrollToActiveItem" as any);
                const option = { block: "nearest" };

                service.handleKeydown(keyBoardEventMock as any);

                expect(spy).toHaveBeenCalledWith(option);
            });

            it("should call 'keyboardEventsManager.onKeydown' on arrow down/up key", () => {
                const spy = spyOn(
                    service["keyboardEventsManager"],
                    "onKeydown" as any
                );
                const arrowDownEvent = {
                    ...keyBoardEventMock,
                    ...{ code: KEYBOARD_CODE.ARROW_DOWN },
                };

                service.handleKeydown(arrowDownEvent as any);

                expect(spy).toHaveBeenCalledWith(arrowDownEvent);

                const arrowUpEvent = {
                    ...keyBoardEventMock,
                    ...{ code: KEYBOARD_CODE.ARROW_UP },
                };

                service.handleKeydown(arrowUpEvent as any);
                expect(spy).toHaveBeenCalledWith(arrowUpEvent);
            });

            it("should call 'liveAnnouncer.announce' on arrow down/up key", () => {
                const itemTitle = "Item 1";
                spyOn(service["keyboardEventsManager"], "onKeydown" as any);
                spyOnProperty(
                    service["keyboardEventsManager"],
                    "activeItem"
                ).and.returnValue({ value: itemTitle });
                const arrowDownEvent = {
                    ...keyBoardEventMock,
                    ...{ code: KEYBOARD_CODE.ARROW_DOWN },
                };

                service.handleKeydown(arrowDownEvent as any);
                expect(service.liveAnnouncer.announce).toHaveBeenCalledWith(
                    itemTitle
                );
            });

            it("should call popup 'toggle' method on tab key", () => {
                const spy = spyOn(service.popup, "toggle");
                const tabEvent = {
                    ...keyBoardEventMock,
                    ...{ code: KEYBOARD_CODE.TAB },
                };

                service.handleKeydown(tabEvent as any);
                expect(spy).toHaveBeenCalled();
            });

            it("should call 'announceDropdown' on tab key", () => {
                const spy = spyOn(service, "announceDropdown" as any);
                const tabEvent = {
                    ...keyBoardEventMock,
                    ...{ code: KEYBOARD_CODE.TAB },
                };

                service.handleKeydown(tabEvent as any);
                expect(spy).toHaveBeenCalledWith(service.popup.showing);
            });

            it("should call 'keyboardEventsManager.onKeydown' on pageUp/pageDown key", () => {
                const spy = spyOn(
                    service["keyboardEventsManager"],
                    "onKeydown" as any
                );
                const pageDownEvent = {
                    ...keyBoardEventMock,
                    ...{ code: KEYBOARD_CODE.PAGE_DOWN },
                };

                service.handleKeydown(pageDownEvent as any);

                expect(spy).toHaveBeenCalledWith(pageDownEvent);

                const pageUpEvent = {
                    ...keyBoardEventMock,
                    ...{ code: KEYBOARD_CODE.PAGE_UP },
                };

                service.handleKeydown(pageUpEvent as any);
                expect(spy).toHaveBeenCalledWith(pageUpEvent);
            });

            it("should call 'handleClosedKeyDown' if popup showing = false", () => {
                service.popup.showing = false;
                const spy = spyOn(service, "handleClosedKeyDown" as any);

                service.handleKeydown(keyBoardEventMock as any);

                expect(spy).toHaveBeenCalledWith(keyBoardEventMock);
            });

            it("should call prevent default on arrowDown key", () => {
                service.popup.showing = false;
                const arrowDownEvent = {
                    ...keyBoardEventMock,
                    ...{ code: KEYBOARD_CODE.ARROW_DOWN },
                };
                const spy = spyOn(arrowDownEvent, "preventDefault");

                service.handleKeydown(arrowDownEvent as any);

                expect(spy).toHaveBeenCalled();
            });
        });
        describe("setActiveItem", () => {
            it("should call keyboardEventsManager.setActiveItem method", () => {
                const spy = spyOn(
                    service["keyboardEventsManager"],
                    "setActiveItem"
                );
                const mock = {};

                service.setActiveItem(mock);
                expect(spy).toHaveBeenCalledWith(mock);
            });
        });

        describe("resetActiveItem", () => {
            it("should call keyboardEventsManager.setActiveItem method", () => {
                const spy = spyOn(
                    service["keyboardEventsManager"],
                    "setActiveItem"
                );

                service.resetActiveItem();
                expect(spy).toHaveBeenCalledWith(-1);
            });
        });

        describe("setFirstItemActive", () => {
            it("should call keyboardEventsManager.setFirstItemActive method", () => {
                const spy = spyOn(
                    service["keyboardEventsManager"],
                    "setFirstItemActive"
                );

                service.setFirstItemActive();
                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
