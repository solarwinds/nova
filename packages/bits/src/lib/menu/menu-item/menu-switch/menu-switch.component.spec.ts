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

import { MenuSwitchComponent } from "./menu-switch.component";
import { MockedChangeDetectorRef } from "../../../../spec-helpers/angular";
import { MenuGroupComponent } from "../menu-group/menu-group.component";

describe("components >", () => {
    describe("menu-switch >", () => {
        describe("stopPropagationOfClick function >", () => {
            let mockEvent: MouseEvent;
            let spyForSwitchEmit: jasmine.Spy;
            let menuSwitch: MenuSwitchComponent;

            beforeEach(() => {
                mockEvent = jasmine.createSpyObj("event", [
                    "preventDefault",
                    "stopPropagation",
                ]);
                menuSwitch = new MenuSwitchComponent(
                    new MenuGroupComponent(),
                    new MockedChangeDetectorRef()
                );
                spyForSwitchEmit = spyOn(menuSwitch.actionDone, "emit");
            });

            it(`should prevent default behavior, stop propagation of click event and not emit if disabled`, () => {
                menuSwitch.disabled = true;
                menuSwitch.stopPropagationOfClick(mockEvent);

                expect(mockEvent.preventDefault).not.toHaveBeenCalled();
                expect(mockEvent.stopPropagation).toHaveBeenCalled();
                expect(spyForSwitchEmit).not.toHaveBeenCalled();
            });

            it(`should prevent default behavior, not stop propagation and emit if not disabled`, () => {
                menuSwitch.disabled = false;
                menuSwitch.stopPropagationOfClick(mockEvent);

                expect(mockEvent.preventDefault).toHaveBeenCalled();
                expect(mockEvent.stopPropagation).toHaveBeenCalled();
                expect(spyForSwitchEmit).toHaveBeenCalledWith(true);
            });
        });
    });
});
