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

import { by, ElementFinder, Key } from "protractor";

import { Atom } from "../../atom";

export class TextboxAtom extends Atom {
    public static CSS_CLASS = "nui-textbox";

    public get input(): ElementFinder {
        return super.getElement().element(by.className("form-control"));
    }

    /**
     * Because typescript getters and setters do not support async\await features I'm changing this
     * getter to a regular public method. Any suggestions are welcomed.
     *
     * See this issue for more information on this technical limitation:
     * https://github.com/Microsoft/TypeScript/issues/14982#issuecomment-294437284
     * https://github.com/tc39/ecmascript-asyncawait/issues/15
     */

    public getValue = async (): Promise<string> =>
        this.input.getAttribute("value");

    public acceptText = async (text: string): Promise<void> =>
        this.input.sendKeys(text);

    public clearText = async (): Promise<void> => this.input.clear();

    public deleteTextManually = async (): Promise<void> =>
        this.input.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);

    public hasAttribute = async (attrName: string): Promise<boolean> =>
        (await this.input.getAttribute(attrName)) !== null;

    public disabled = async (): Promise<boolean> =>
        this.hasAttribute("disabled");

    public isReadonly = async (): Promise<boolean> =>
        this.hasAttribute("readonly");

    public async hasError(): Promise<boolean> {
        return super.hasClass("has-error");
    }
}
