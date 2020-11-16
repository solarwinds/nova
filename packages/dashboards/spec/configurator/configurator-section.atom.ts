import { Atom } from "@solarwinds/nova-bits/sdk/atoms";

import { AccordionAtom } from "./accordion.atom";

export class ConfiguratorSectionAtom extends Atom {
    public static CSS_CLASS = "nui-widget-configurator-section";

    private root = this.getElement();

    public getAccordionByIndex = (index: number): AccordionAtom => Atom.findIn<AccordionAtom>(AccordionAtom, this.root, index);


}
