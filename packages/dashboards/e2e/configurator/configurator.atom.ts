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

import { Atom, ButtonAtom } from "@nova-ui/bits/sdk/atoms-playwright";

import { ConfiguratorSectionAtom } from "./configurator-section.atom";
import { AccordionAtom } from "./accordion.atom";

export class ConfiguratorAtom extends Atom {
    public static CSS_CLASS = "nui-configurator";

    public getSectionByIndex(index: number): ConfiguratorSectionAtom {
        return Atom.findIn<ConfiguratorSectionAtom>(
            ConfiguratorSectionAtom,
            this.getLocator()
        ).nth<ConfiguratorSectionAtom>(ConfiguratorSectionAtom, index);
    }

    public async getAccordion(
        sectionHeaderSubstring: string,
        accordionLabel: string
    ): Promise<AccordionAtom | undefined> {
        const section = await this.getSectionByHeaderText(
            sectionHeaderSubstring,
            true
        );
        return section?.getAccordionByLabel(accordionLabel);
    }

    public getResetColumnsButton(): ButtonAtom {
        return Atom.findIn<ButtonAtom>(
            ButtonAtom,
            this.getLocator().locator("#table-widget-reset-indicator-btn")
        );
    }

    public async getSectionByHeaderText(
        text: string,
        isSubstring = false
    ): Promise<ConfiguratorSectionAtom | undefined> {
        const sections = this.getLocator().locator(
            "nui-widget-configurator-section"
        );
        const count = await sections.count();

        for (let i = 0; i < count; i++) {
            const section = sections.nth(i);
            const headerText = await section
                .locator(".widget-configurator-section__header")
                .innerText();
            if (
                (isSubstring && headerText?.includes(text)) ||
                text === headerText
            ) {
                return new ConfiguratorSectionAtom(section);
            }
        }
    }
}
