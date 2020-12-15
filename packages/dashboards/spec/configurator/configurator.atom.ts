import { Atom } from "@nova-ui/bits/sdk/atoms";

import { ConfiguratorSectionAtom } from "./configurator-section.atom";

export class ConfiguratorAtom extends Atom {
    public static CSS_CLASS = "nui-configurator";

    private root = this.getElement();

    public getSectionByIndex = (index: number): ConfiguratorSectionAtom => Atom.findIn<ConfiguratorSectionAtom>(ConfiguratorSectionAtom, this.root, index);

}
