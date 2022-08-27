import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { IconAtom } from "../icon/icon.atom";

export class ExpanderAtom extends Atom {
    public static CSS_CLASS = "nui-expander";
    public static animationDuration = 350;

    private root = this.getElement();
    private body = this.root.all(by.css(".nui-expander__body-wrapper")).first();

    public isExpanded = async (): Promise<boolean> =>
        (await this.body.getSize()).height > 0;

    public isCollapsed = async (): Promise<boolean> =>
        !(await this.isExpanded());

    public async isContentDisplayed(
        cssSelectorSet: string | string[]
    ): Promise<boolean> {
        if (!Array.isArray(cssSelectorSet)) {
            cssSelectorSet = [cssSelectorSet];
        }

        const verifiers = cssSelectorSet.map(async (selector: string) =>
            this.root.element(by.css(selector)).isDisplayed()
        );

        return Promise.all(verifiers).then((result) =>
            result.every((resultItem: boolean) => resultItem)
        );
    }

    public async isContentAttachedToDOM(
        cssSelectorSet: string | string[]
    ): Promise<boolean> {
        if (!Array.isArray(cssSelectorSet)) {
            cssSelectorSet = [cssSelectorSet];
        }

        const verifiers = cssSelectorSet.map(async (selector: string) =>
            this.root.element(by.css(selector)).isPresent()
        );

        return Promise.all(verifiers).then((result) =>
            result.every((resultItem: boolean) => resultItem)
        );
    }

    public isHeaderIconPresent = async (): Promise<boolean> =>
        IconAtom.findIn(
            IconAtom,
            this.getElement().element(
                by.css(".nui-expander__header-content-icon")
            )
        )
            .getElement()
            .isPresent();

    public getExpanderToggleIcon = (): IconAtom =>
        IconAtom.findIn(
            IconAtom,
            this.getElement().element(by.css(".nui-expander__header-icon"))
        );

    public getBodyLeftBorderWidth = async (): Promise<string> =>
        this.root
            .all(by.css(".nui-expander__body"))
            .first()
            .getCssValue("border-left-width");

    public toggle = async (): Promise<void> => {
        await this.root.element(by.css(".nui-expander__header")).click();
        // This is unfortunate, but there is no other way to wait for angular animation, other than doing a special build
        // We should try to test it in units as good as possible
        return browser.sleep(ExpanderAtom.animationDuration * 1.5);
    };

    public getHeadingText = async (): Promise<string> =>
        this.root
            .element(by.css(".nui-expander__header-content-wrapper"))
            .getText();

    public getHeaderHeight = async (): Promise<number> =>
        (
            await this.root
                .element(by.css(".nui-expander__header-title"))
                .getSize()
        ).height;

    public getCustomHeaderWidth = async (): Promise<number> =>
        (
            await this.root
                .element(by.css(".nui-expander__custom-header"))
                .getSize()
        ).width;
}
