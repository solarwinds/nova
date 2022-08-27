import { Atom } from "../../atom";

export class DividerAtom extends Atom {
    public static CSS_CLASS = "nui-divider";

    public async isVertical(): Promise<boolean> {
        return super.hasClass("nui-divider--vertical");
    }

    public async isHorizontal(): Promise<boolean> {
        return super.hasClass("nui-divider--horizontal");
    }
}
