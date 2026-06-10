import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { Helpers, expect } from "../../setup";

export class OverlayAtom extends Atom {
    get cdkContainerPane(): Locator {
        return Helpers.page.locator(`.${OverlayAtom.CDK_CONTAINER_PANE}`);
    }
    get cdkContainerBox(): Locator {
        return Helpers.page.locator(`.${OverlayAtom.CDK_CONTAINER_BOX}`);
    }
    get cdkContainer(): Locator {
        return Helpers.page.locator(`.${OverlayAtom.CDK_CONTAINER}`);
    }

    public static CSS_CLASS = "nui-overlay";
    public static CDK_CONTAINER = "cdk-overlay-container";
    public static CDK_CONTAINER_BOX =
        "cdk-overlay-connected-position-bounding-box";
    public static CDK_CONTAINER_PANE = "cdk-overlay-pane";

    public async isOpened(): Promise<boolean> {
        const count = await this.cdkContainerPane.count();
        if (count === 0) {
            return false;
        }

        for (let i = 0; i < count; i++) {
            if (await this.cdkContainerPane.nth(i).isVisible()) {
                return true;
            }
        }
        return false;
    }

    public async toBeOpened(): Promise<void> {
        await expect(this.cdkContainerPane).toBeVisible();
    }
    public async toNotBeOpened(): Promise<void> {
        await expect(this.cdkContainerPane).toBeHidden();
    }
}
