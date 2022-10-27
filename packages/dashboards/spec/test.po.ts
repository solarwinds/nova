// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
