import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { by, ElementFinder } from "protractor";

import { AccordionAtom } from "./accordion.atom";
import { ConfiguratorSectionAtom } from "./configurator-section.atom";
import { DashboardWizardAtom } from "./dashboard-wizard.atom";

export class ConfiguratorAtom extends Atom {
    public static CSS_CLASS = "nui-configurator";

    public get wizard(): DashboardWizardAtom {
        return Atom.findIn(DashboardWizardAtom, this.root);
    }

    private root = this.getElement();

    public getSectionByIndex = (index: number): ConfiguratorSectionAtom => Atom.findIn<ConfiguratorSectionAtom>(ConfiguratorSectionAtom, this.root, index);

    public async getAccordion(sectionHeaderSubstring: string, accordionLabel: string): Promise<AccordionAtom | undefined> {
        const section = await this.getSectionByHeaderText(sectionHeaderSubstring, true);
        return section?.getAccordionByLabel(accordionLabel);
    }

    public async getSectionByHeaderText(text: string, isSubstring = false): Promise<ConfiguratorSectionAtom | undefined> {
        const configSections = this.root.all(by.css("nui-widget-configurator-section"));
        let section: ElementFinder | undefined;
        await configSections.each(async (element: ElementFinder | undefined) => {
            const headerText = await element?.element(by.css(".widget-configurator-section__header")).getText();
            if ((isSubstring && headerText?.includes(text)) || text === headerText) {
                section = element;
            }
        });

        if (section) {
            return Atom.findIn<ConfiguratorSectionAtom>(ConfiguratorSectionAtom, section);
        }
    }

}
