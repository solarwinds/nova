import { Locator } from "playwright-core";

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

    public async getName(): Promise<string | null> {
        return super.getLocator().getAttribute("icon");
    }

    public async getStatus(): Promise<string | null> {
        return super.getLocator().getAttribute("status");
    }

    public async getCounter(): Promise<string | null> {
        return super.getLocator().getAttribute("counter");
    }

    public getIconByCssClass(cssClass: string): Locator {
        return super.getLocator().locator(cssClass);
    }

    public async getSize(): Promise<string> {
        const css = await super.getLocator().getAttribute("class");
        if (!css) {
            return "";
        }
        if (css.search(IconAtom.iconSize.small) !== -1) {
            return IconAtom.iconSize.small;
        } else if (css.search(IconAtom.iconSize.medium) !== -1) {
            return IconAtom.iconSize.medium;
        } else {
            return IconAtom.iconSize.default;
        }
    }
}
