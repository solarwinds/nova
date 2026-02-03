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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";

export class QuickPickerAtom extends Atom {
    public static CSS_CLASS = "nui-quick-picker";

    public selectPresetByTitle = async (title: string): Promise<void> => {
        await this.getPresetByName(title).click();
    };

    public hoverPresetByTitle = async (title: string): Promise<void> => {
        await this.getPresetByName(title).hover();
    };

    public async getSelectedPreset(): Promise<string | null> {
        const selectedElement = this.getLocator().locator(
            ".nui-quick-picker__preset--selected"
        );
        return (await selectedElement.isVisible())
            ? await selectedElement.innerText()
            : null;
    }

    private getPresetByName(title: string): Locator {
        return this.getLocator()
            .locator(".nui-quick-picker__preset")
            .filter({ hasText: title })
            .first();
    }
}
