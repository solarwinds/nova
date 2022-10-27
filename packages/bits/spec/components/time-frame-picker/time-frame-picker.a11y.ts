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

import { browser } from "protractor";

import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { TimeFramePickerAtom, PopoverAtom } from "../public_api";

describe("a11y: time-frame-picker", () => {
    const rulesToDisable: string[] = [];
    let popoverWithTimeframePicker: PopoverAtom;
    let popoverWithDatePicker: PopoverAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser(
            "time-frame-picker/time-frame-picker-visual-test"
        );

        popoverWithTimeframePicker = Atom.find(
            PopoverAtom,
            "nui-demo-visual-default-popover"
        );
        popoverWithDatePicker = Atom.find(
            PopoverAtom,
            "nui-demo-visual-datepicker-popover"
        );
    });

    it("should check a11y of time-frame-picker", async () => {
        await popoverWithTimeframePicker.open();
        await assertA11y(
            browser,
            TimeFramePickerAtom.CSS_CLASS,
            rulesToDisable
        );
    });

    it("should check a11y of time-frame-picker  with date picker", async () => {
        await popoverWithDatePicker.open();
        await assertA11y(
            browser,
            TimeFramePickerAtom.CSS_CLASS,
            rulesToDisable
        );
    });
});
