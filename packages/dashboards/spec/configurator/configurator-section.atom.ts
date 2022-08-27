import { by, ElementFinder } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

import { AccordionAtom } from "./accordion.atom";

export class ConfiguratorSectionAtom extends Atom {
    public static CSS_CLASS = "nui-widget-configurator-section";

    private root = this.getElement();

    public getAccordionByIndex = (index: number): AccordionAtom =>
        Atom.findIn<AccordionAtom>(AccordionAtom, this.root, index);

    public async getAccordionByLabel(
        label: string
    ): Promise<AccordionAtom | undefined> {
        const accordions = this.root.all(
            by.className("nui-widget-editor-accordion")
        );
        let accordion: ElementFinder | undefined;
        await accordions.each(async (element: ElementFinder | undefined) => {
            const text = await element
                ?.element(by.className("nui-text-label"))
                .getText();
            if (text === label) {
                accordion = element;
            }
        });

        if (accordion) {
            return Atom.findIn<AccordionAtom>(AccordionAtom, accordion);
        }
    }
}
