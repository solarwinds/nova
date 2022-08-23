import { browser, by, ElementFinder } from "protractor";
import { ISize } from "selenium-webdriver";

import { Atom } from "../../atom";
import { IconAtom } from "../icon/icon.atom";

export class PanelAtom extends Atom {
    public static CSS_CLASS = "nui-panel";
    public static COLLAPSED_CSS = "nui-panel--is-collapsed";
    public static HEADER_BUTTON_TOGGLE = "nui-panel__header-btn";
    public static HEADER_BUTTON_CLOSE = "nui-panel__header-btn--close";
    public static HEADER_CONTENT_CSS = "nui-panel__header";
    public static SIDE_PANE_CSS = "nui-panel__side-pane";
    public static CENTER_PANE_CSS = "nui-panel__center-pane";
    public static FOOTER_CONTENT_CSS = "nui-panel__footer";

    private toggleElement = this.getElement().element(
        by.className(PanelAtom.HEADER_BUTTON_TOGGLE)
    );

    public getToggleIcon = (): IconAtom =>
        Atom.findIn(IconAtom, this.toggleElement);

    public isToggleIconPresent = async (): Promise<boolean> =>
        await this.toggleElement.isPresent();

    public toggleExpanded = async (): Promise<boolean> => {
        const expanded = await this.isExpanded();
        await this.toggleElement.click();

        // Wait for animation to finish
        return browser.wait(
            async () => (await this.isExpanded()) === !expanded,
            1000,
            "Animation timed out"
        );
    };

    public closeSidePane = async (): Promise<void> =>
        await this.getElement()
            .element(by.className(PanelAtom.HEADER_BUTTON_CLOSE))
            .click();

    public hoverOnSidePane = async (): Promise<void> => {
        await browser
            .actions()
            .mouseMove(
                this.getElement().element(
                    by.css(
                        `.${PanelAtom.CSS_CLASS} .${PanelAtom.SIDE_PANE_CSS}`
                    )
                )
            )
            .perform();
    };

    public async getCenterPaneElementSize(): Promise<ISize> {
        return super
            .getElement()
            .element(by.className(PanelAtom.CENTER_PANE_CSS))
            .getSize();
    }

    public async getSidePaneElementSize(): Promise<ISize> {
        return super
            .getElement()
            .element(by.className(PanelAtom.SIDE_PANE_CSS))
            .getSize();
    }

    public async isPaneDisplayed(orientation: string): Promise<boolean> {
        return super
            .getElement()
            .element(
                by.css(
                    `.${PanelAtom.CSS_CLASS}--${orientation} .${PanelAtom.SIDE_PANE_CSS}`
                )
            )
            .isDisplayed();
    }

    public async isCollapsed(): Promise<boolean> {
        return super.hasClass(PanelAtom.COLLAPSED_CSS);
    }

    public async isExpanded(): Promise<boolean> {
        return super
            .hasClass(PanelAtom.COLLAPSED_CSS)
            .then((value: boolean) => !value);
    }

    public getHeaderContent(): ElementFinder {
        return super
            .getElement()
            .element(by.className(PanelAtom.HEADER_CONTENT_CSS));
    }

    public isHeaderDisplayed = async (): Promise<boolean> =>
        this.getHeaderContent().isDisplayed();

    public getFooterContent(): ElementFinder {
        return super
            .getElement()
            .element(by.className(PanelAtom.FOOTER_CONTENT_CSS));
    }

    public isFooterDisplayed = async (): Promise<boolean> =>
        this.getFooterContent().isDisplayed();
}
