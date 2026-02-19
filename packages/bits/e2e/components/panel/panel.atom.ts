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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { expect, Helpers } from "../../setup";
import { IconAtom } from "../icon/icon.atom";

export class PanelAtom extends Atom {
    public static CSS_CLASS = "nui-panel";
    private static COLLAPSED_CSS = "nui-panel--is-collapsed";

    public get toggleButton(): Locator {
        return this.getLocator().locator(".nui-panel__header-btn");
    }

    public get closeButton(): Locator {
        return this.getLocator().locator(".nui-panel__header-btn--close");
    }

    public get header(): Locator {
        return this.getLocator().locator(".nui-panel__header");
    }

    public get sidePane(): Locator {
        return this.getLocator().locator(".nui-panel__side-pane");
    }

    public get centerPane(): Locator {
        return this.getLocator().locator(".nui-panel__center-pane");
    }

    public get footer(): Locator {
        return this.getLocator().locator(".nui-panel__footer");
    }

    public get toggleIcon(): IconAtom {
        return Atom.findIn<IconAtom>(IconAtom, this.toggleButton);
    }

    public async toggle(): Promise<void> {
        const wasCollapsed = await this.getLocator().first()
            .getAttribute("class")
            .then((cls) => (cls ?? "").includes(PanelAtom.COLLAPSED_CSS));

        await this.toggleButton.first().click();

        if (wasCollapsed) {
            await this.toBeExpanded();
        } else {
            await this.toBeCollapsed();
        }
    }

    public async closeSidePane(): Promise<void> {
        await this.closeButton.click();
    }

    public async hoverOnSidePane(): Promise<void> {
        await this.sidePane.hover();
    }

    public async toBeCollapsed(): Promise<void> {
        await this.waitForAnimationEnd();
        await expect(this.getLocator().first()).toContainClass(
            PanelAtom.COLLAPSED_CSS
        );
    }

    public async toBeExpanded(): Promise<void> {
        await this.waitForAnimationEnd();
        await expect(this.getLocator().first()).not.toContainClass(
            PanelAtom.COLLAPSED_CSS
        );
    }

    private async waitForAnimationEnd(): Promise<void> {
        await expect(this.getLocator().first()).not.toContainClass(
            "nui-panel--animating"
        );
    }

    public async toHavePaneVisible(orientation: string): Promise<void> {
        await expect(
            this.getLocator().and(Helpers.page.locator(`.nui-panel--${orientation}`)).locator(
                `.nui-panel__side-pane`
            )
        ).toBeVisible();
    }

    public async toHavePaneHidden(orientation: string): Promise<void> {
        await expect(
            this.getLocator().and(Helpers.page.locator(`.nui-panel--${orientation}`)).locator(
                `.nui-panel__side-pane`
            )
        ).toBeHidden();
    }

    public async toHaveHeaderVisible(): Promise<void> {
        await expect(this.header).toBeVisible();
    }

    public async toHaveHeaderHidden(): Promise<void> {
        await expect(this.header).toBeHidden();
    }

    public async toHaveFooterVisible(): Promise<void> {
        await expect(this.footer).toBeVisible();
    }

    public async toHaveFooterHidden(): Promise<void> {
        await expect(this.footer).toBeHidden();
    }

    public async toHaveToggleIconVisible(): Promise<void> {
        await this.toggleIcon.toBeVisible();
    }

    public async toHaveToggleIconHidden(): Promise<void> {
        await this.toggleIcon.toBeHidden();
    }
}
