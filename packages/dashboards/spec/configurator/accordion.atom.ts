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

import { by } from "protractor";

import {
    Atom,
    ExpanderAtom,
    SelectV2Atom,
    TextboxNumberAtom,
} from "@nova-ui/bits/sdk/atoms";

export class AccordionAtom extends Atom {
    public static CSS_CLASS = "nui-widget-editor-accordion";

    private root = this.getElement();

    private expander = Atom.findIn(ExpanderAtom, this.root);

    public toggle = async (): Promise<void> => {
        await this.expander.toggle();
    };

    public getSelectByIndex = (index: number): SelectV2Atom =>
        Atom.findIn<SelectV2Atom>(SelectV2Atom, this.root, index);

    public getSelect = (className: string): SelectV2Atom =>
        Atom.findIn<SelectV2Atom>(
            SelectV2Atom,
            this.root.element(by.className(className))
        );

    public getTextBoxNumberInput = (className: string): TextboxNumberAtom =>
        Atom.findIn<TextboxNumberAtom>(
            TextboxNumberAtom,
            this.root.element(by.className(className))
        );
}
