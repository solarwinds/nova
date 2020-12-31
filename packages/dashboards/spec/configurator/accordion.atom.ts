import { Atom, ExpanderAtom, SelectV2Atom, TextboxNumberAtom } from "@nova-ui/bits/sdk/atoms";
import { by } from "protractor";

export class AccordionAtom extends Atom {
    public static CSS_CLASS = "nui-widget-editor-accordion";

    private root = this.getElement();

    private expander = Atom.findIn(ExpanderAtom, this.root);

    public toggle = async () => {
        await this.expander.toggle();
    }

    public getSelectByIndex = (index: number): SelectV2Atom => Atom.findIn<SelectV2Atom>(SelectV2Atom, this.root, index);

    public getSelect = (className: string): SelectV2Atom =>
        Atom.findIn<SelectV2Atom>(SelectV2Atom, this.root.element(by.className(className)))
        
    public getTextBoxNumberInput = (className: string): TextboxNumberAtom =>
        Atom.findIn<TextboxNumberAtom>(TextboxNumberAtom, this.root.element(by.className(className)))
}
