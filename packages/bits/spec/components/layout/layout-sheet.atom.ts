import { Atom } from "../../atom";

export class LayoutSheetAtom extends Atom {
    public static CSS_CLASS = "nui-sheet";

    async getWidth(): Promise<number> {
        return (await super.getElement().getSize()).width;
    }

    async getHeight(): Promise<number> {
        return (await super.getElement().getSize()).height;
    }
}
