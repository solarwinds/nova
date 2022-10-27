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

import { by, ElementFinder } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

import { AccordionAtom } from "./accordion.atom";
import { ConfiguratorSectionAtom } from "./configurator-section.atom";
import { DashboardWizardAtom } from "./dashboard-wizard.atom";

export class ConfiguratorAtom extends Atom {
    public static CSS_CLASS = "nui-configurator";

    public get wizard(): DashboardWizardAtom {
        return Atom.findIn(DashboardWizardAtom, this.root);
    }

    private root = this.getElement();

    public getSectionByIndex = (index: number): ConfiguratorSectionAtom =>
        Atom.findIn<ConfiguratorSectionAtom>(
            ConfiguratorSectionAtom,
            this.root,
            index
        );

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

    public getResetColumnsButton() {
        return this.root.element(by.id("table-widget-reset-indicator-btn"));
    }
    public async getSectionByHeaderText(
        text: string,
        isSubstring = false
    ): Promise<ConfiguratorSectionAtom | undefined> {
        const configSections = this.root.all(
            by.css("nui-widget-configurator-section")
        );
        let section: ElementFinder | undefined;
        await configSections.each(
            async (element: ElementFinder | undefined) => {
                const headerText = await element
                    ?.element(by.css(".widget-configurator-section__header"))
                    .getText();
                if (
                    (isSubstring && headerText?.includes(text)) ||
                    text === headerText
                ) {
                    section = element;
                }
            }
        );

        if (section) {
            return Atom.findIn<ConfiguratorSectionAtom>(
                ConfiguratorSectionAtom,
                section
            );
        }
    }

    public async getConfigSections(): Promise<any[]> {
        return this.root.all(by.css("nui-widget-configurator-section"));
    }
}
