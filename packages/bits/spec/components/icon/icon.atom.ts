import { by,
        ElementArrayFinder,
        ElementFinder
} from "protractor";

import { Atom } from "../../atom";

export enum IconSize {
    small,
    default,
    medium,
}

export class IconAtom extends Atom {
    public static CSS_CLASS = "nui-icon";

    public static iconSize = {
        small: "sm",
        default: "default",
        medium: "md",
    };

    static count = async (item: ElementFinder, extStyle = ""): Promise<number> => item.all(by.css(".nui-icon" + extStyle)).count();

    public async getName(): Promise<string> { return super.getElement().getAttribute("icon"); }

    public async getStatus(): Promise<string> { return super.getElement().getAttribute("status"); }

    public async getCounter(): Promise<string> { return super.getElement().getAttribute("counter"); }

    public getIconByCssClass(cssClass: string): ElementArrayFinder { return super.getElement().all(by.className(cssClass)); }

    public async getSize(): Promise<string> {
        return super.getElement().getAttribute("class").then(async (css: string) => {
            if (css.search(IconAtom.iconSize.small) !== -1) {
                return IconAtom.iconSize.small;
            } else if (css.search(IconAtom.iconSize.medium) !== -1) {
                return IconAtom.iconSize.medium;
            } else {
                return IconAtom.iconSize.default;
            }
        });
    }
}
