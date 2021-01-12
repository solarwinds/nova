import { BaseSelectV2Atom } from "./base-select-v2.atom";

export class SelectV2Atom extends BaseSelectV2Atom {
    public static CSS_CLASS = "nui-select-v2";

    public async getInputText(): Promise<string> {
        return this.getElement().getText();
    }
}
