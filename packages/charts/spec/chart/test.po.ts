import { browser, by, element, ElementFinder } from "protractor";

export class TestPage {
    private chbDarkTheme: ElementFinder;
    private root: ElementFinder;

    constructor() {
        this.root = element(by.className("charts-test-harness"));
        this.chbDarkTheme = this.root.element(by.id("dark-theme"));
    }

    public async enableDarkTheme(): Promise<void> {
        return this.updateSelectable(this.chbDarkTheme, true);
    }

    public async disableDarkTheme(): Promise<void> {
        return this.updateSelectable(this.chbDarkTheme, false);
    }

    public async resetMousePosition(): Promise<void> {
        return browser.actions().mouseMove({ x: 0, y: 0 }).perform();
    }

    private async updateSelectable(
        input: ElementFinder,
        value: boolean
    ): Promise<void> {
        const currentValue = await input.isSelected();
        if (currentValue === value) {
            return;
        }
        return input.click();
    }
}
