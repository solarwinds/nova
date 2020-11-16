import { Atom, ExpanderAtom, SelectV2Atom } from "@solarwinds/nova-bits/sdk/atoms";

export class AccordionAtom extends Atom {
    public static CSS_CLASS = "nui-widget-editor-accordion";

    private root = this.getElement();

    private expander = Atom.findIn(ExpanderAtom, this.root);

    public toggle = async () => {
        await this.expander.toggle();
    }

    public getSelectByIndex = (index: number): SelectV2Atom => Atom.findIn<SelectV2Atom>(SelectV2Atom, this.root, index);
}
