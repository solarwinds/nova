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

import { Atom } from "@nova-ui/bits/sdk/atoms-playwright";

import { AccordionAtom } from "./accordion.atom";

export class ConfiguratorSectionAtom extends Atom {
    public static CSS_CLASS = "nui-widget-configurator-section";

    public getAccordionByIndex(index: number): AccordionAtom {
        return Atom.findIn<AccordionAtom>(AccordionAtom, this.getLocator()).nth<AccordionAtom>(
            AccordionAtom,
            index
        );
    }

    public async getAccordionByLabel(
        label: string
    ): Promise<AccordionAtom | undefined> {
        const accordions = this.getLocator().locator(
            ".nui-widget-editor-accordion"
        );
        const count = await accordions.count();

        for (let i = 0; i < count; i++) {
            const accordion = accordions.nth(i);
            const text = await accordion
                .locator(".nui-text-label")
                .innerText();
            if (text === label) {
                return new AccordionAtom(accordion);
            }
        }
    }
}
