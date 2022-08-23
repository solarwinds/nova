import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

import { DashboardAtom } from "./dashboard.atom";

export class TestPage {
    private chbEditMode: ElementFinder;
    private chbDsError: ElementFinder;
    private chbDarkTheme: ElementFinder;
    private root: ElementFinder;

    constructor() {
        this.root = element(by.className("dashboard-test-harness"));
        this.chbEditMode = this.root.element(by.id("edit-mode"));
        this.chbDsError = this.root.element(by.id("ds-error"));
        this.chbDarkTheme = this.root.element(by.id("dark-theme"));
    }

    public get dashboard(): DashboardAtom {
        return Atom.findIn(DashboardAtom, this.root);
    }

    public async enableEditMode(): Promise<void> {
        return this.updateSelectable(this.chbEditMode, true);
    }

    public async disableEditMode(): Promise<void> {
        return this.updateSelectable(this.chbEditMode, false);
    }

    public async enableDataSourceErrors(): Promise<void> {
        return this.updateSelectable(this.chbDsError, true);
    }

    public async disableDataSourceErrors(): Promise<void> {
        return this.updateSelectable(this.chbDsError, false);
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

    public async editWidget(title: string): Promise<void> {
        return (
            await this.dashboard.getWidgetByHeaderTitleText(title)
        )?.header.clickEdit();
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
