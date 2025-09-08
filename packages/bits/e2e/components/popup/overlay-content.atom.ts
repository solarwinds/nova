import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { Helpers } from "../../setup";

export class OverlayContentAtom extends Atom {
    public static CSS_CLASS = "nui-overlay";

    public get body(): Locator {
        return Helpers.page.locator("body");
    }
}
