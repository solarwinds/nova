import { Atom } from "../../atom";

export class ImageAtom extends Atom {
    public static CSS_CLASS = "nui-image";

    public async getName(): Promise<string> { return super.getElement().getAttribute("image"); }

    public async getWidth(): Promise<string> { return super.getElement().getCssValue("width"); }

    public async getHeight(): Promise<string> { return super.getElement().getCssValue("height"); }

    public async getFloatings(): Promise<string> { return super.getElement().getCssValue("float"); }
}
