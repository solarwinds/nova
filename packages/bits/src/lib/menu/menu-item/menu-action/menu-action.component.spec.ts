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

import { MockedChangeDetectorRef } from "../../../../spec-helpers/angular";
import { MenuGroupComponent } from "../menu-group/menu-group.component";
import { MenuActionComponent } from "./menu-action.component";

describe("components >", () => {
    describe("menu-action >", () => {
        describe("handleClick function >", () => {
            let mockEvent: MouseEvent;
            let menuAction: MenuActionComponent;

            beforeEach(() => {
                mockEvent = jasmine.createSpyObj("event", [
                    "preventDefault",
                    "stopPropagation",
                ]);
                menuAction = new MenuActionComponent(
                    new MenuGroupComponent(),
                    new MockedChangeDetectorRef()
                );
            });

            it(`should prevent default behavior and stop propagation of click event if disabled`, () => {
                menuAction.disabled = true;
                menuAction.handleClick(mockEvent);

                expect(mockEvent.preventDefault).toHaveBeenCalled();
                expect(mockEvent.stopPropagation).toHaveBeenCalled();
            });

            it(`should prevent default behavior and should not stop propagation of click event if disabled`, () => {
                menuAction.disabled = false;
                menuAction.handleClick(mockEvent);

                expect(mockEvent.preventDefault).toHaveBeenCalled();
                expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            });
        });
    });
});
