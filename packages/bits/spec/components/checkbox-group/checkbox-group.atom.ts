import { by, ElementArrayFinder, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";

export class CheckboxGroupAtom extends Atom {
    public static CSS_CLASS = "nui-checkbox-group";
    private root: ElementFinder = this.getElement();
    private children: ElementArrayFinder = this.root.all(by.className(CheckboxAtom.CSS_CLASS));

    // Used to return specific checkbox element from the group
    public async getCheckbox(title: string): Promise<CheckboxAtom | undefined> {
        const childCount = await this.children.count();
        if (childCount === 0) {
            return undefined;
        }
        for (let i = 0; i < childCount; i++) {
            const checkbox = Atom.findIn<CheckboxAtom>(CheckboxAtom, this.root, i);
            if ((await checkbox.getContent()).toLowerCase() === title.toLowerCase()) {
                return checkbox;
            }
        }
        return undefined;
    }

    public getCheckboxByIndex = (index: number): CheckboxAtom => Atom.findIn<CheckboxAtom>(CheckboxAtom, this.root, index);

    public getFirst = (): CheckboxAtom => this.getCheckboxByIndex(0);

}
