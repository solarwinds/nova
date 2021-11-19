import { Atom } from "../../atom";

export class SelectV2OptionAtom extends Atom {
    public static CSS_CLASS = "nui-select-v2-option";

    public async click(): Promise<void> {
        return this.getElement().click();
    }

    public async isActive(): Promise<boolean> {
        return this.hasClass("active");
    }

    public async getText(): Promise<string> {
        return this.getElement().getText();
    }
}
