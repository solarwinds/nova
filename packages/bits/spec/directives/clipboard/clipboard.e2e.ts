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

import { Key } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/button/button.atom";
import { TextboxAtom } from "../../components/textbox/textbox.atom";
import { Helpers } from "../../helpers";

describe("USERCONTROL Clipboard", () => {
    const buttonAtom: ButtonAtom = Atom.find(ButtonAtom, "clipboardButton");
    const textbox: TextboxAtom = Atom.find(TextboxAtom, "inputTextbox");

    beforeAll(async () => {
        await Helpers.prepareBrowser("common/clipboard");
    });

    it("should copy text to clipboard", async () => {
        const textToCopy = "text to copy";

        await textbox.acceptText(textToCopy);
        await buttonAtom.click();
        await textbox.clearText();
        expect(await textbox.getValue()).toBe("");

        await textbox.input.sendKeys(Key.CONTROL, "v");
        expect(await textbox.getValue()).toBe(textToCopy, "Text wasn't pasted");
    });
});
