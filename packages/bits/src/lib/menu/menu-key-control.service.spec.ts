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

import { MenuKeyControlService } from "./menu-key-control.service";
import { MockedChangeDetectorRef } from "../../spec-helpers/angular";
import { MenuActionComponent } from "./menu-item/menu-action/menu-action.component";
import { MenuGroupComponent } from "./menu-item/menu-group/menu-group.component";
import { MenuItemComponent } from "./menu-item/menu-item/menu-item.component";
import { MenuSwitchComponent } from "./menu-item/menu-switch/menu-switch.component";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";

describe("components >", () => {
    describe("menu-key-control-service >", () => {
        let subject: MenuKeyControlService;

        beforeEach(() => {
            subject = new MenuKeyControlService(
                jasmine.createSpyObj("liveAnnouncer", ["announce"])
            );
            subject.keyboardEventsManager = {} as any;
        });

        describe("handleOpenKeyDown >", () => {
            beforeEach(() => {
                (subject as any).popup = jasmine.createSpyObj("popup", ["toggleOpened"]);
                subject.keyboardEventsManager = jasmine.createSpyObj("keyboardEventsManager", ["onKeydown"]);
            });

            it("should prevent default and perform action on SPACE", () => {
                const event = {
                    code: KEYBOARD_CODE.SPACE,
                    preventDefault: jasmine.createSpy("preventDefault"),
                } as any;

                const activeItemSpy = jasmine.createSpyObj("activeItem", ["doAction"]);
                (subject.keyboardEventsManager as any).activeItem = activeItemSpy;
                (subject.keyboardEventsManager as any).activeItemIndex = 0;

                // Mock shouldCloseOnEnter to return false (like a switch)
                spyOn<any>(subject, "shouldCloseOnEnter").and.returnValue(false);

                (subject as any).handleOpenKeyDown(event);

                expect(event.preventDefault).toHaveBeenCalled();
                expect(activeItemSpy.doAction).toHaveBeenCalledWith(event);
            });

            it("should open closed menu on ENTER", () => {
                (subject as any).popup = jasmine.createSpyObj("popup", ["toggleOpened"]);
                const event = {
                    code: KEYBOARD_CODE.ENTER,
                    preventDefault: jasmine.createSpy("preventDefault"),
                } as any;

                (subject as any).handleClosedKeyDown(event);

                expect(event.preventDefault).toHaveBeenCalled();
                expect((subject as any).popup.toggleOpened).toHaveBeenCalledWith(event);
            });

            it("should open closed menu on SPACE", () => {
                (subject as any).popup = jasmine.createSpyObj("popup", ["toggleOpened"]);
                const event = {
                    code: KEYBOARD_CODE.SPACE,
                    preventDefault: jasmine.createSpy("preventDefault"),
                } as any;

                (subject as any).handleClosedKeyDown(event);

                expect(event.preventDefault).toHaveBeenCalled();
                expect((subject as any).popup.toggleOpened).toHaveBeenCalledWith(event);
            });
        });

        it("should return true for menu action active item", () => {
            (subject.keyboardEventsManager as any).activeItem = new MenuActionComponent(
                new MenuGroupComponent(),
                new MockedChangeDetectorRef()
            );

            expect((subject as any).shouldCloseOnEnter()).toBe(true);
        });

        it("should return true for default menu item active item", () => {
            (subject.keyboardEventsManager as any).activeItem = new MenuItemComponent(
                new MenuGroupComponent(),
                new MockedChangeDetectorRef(),
                { nativeElement: {} } as any
            );

            expect((subject as any).shouldCloseOnEnter()).toBe(true);
        });

        it("should return false for default menu item active item with propagateClose=false", () => {
            const menuItem = new MenuItemComponent(
                new MenuGroupComponent(),
                new MockedChangeDetectorRef(),
                { nativeElement: {} } as any
            );
            menuItem.propagateClose = false;
            (subject.keyboardEventsManager as any).activeItem = menuItem;

            expect((subject as any).shouldCloseOnEnter()).toBe(false);
        });

        it("should return false for menu switch active item", () => {
            (subject.keyboardEventsManager as any).activeItem = new MenuSwitchComponent(
                subject,
                new MenuGroupComponent(),
                new MockedChangeDetectorRef()
            );

            expect((subject as any).shouldCloseOnEnter()).toBe(false);
        });
    });
});
