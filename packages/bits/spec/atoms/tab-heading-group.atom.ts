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

import { by, ElementFinder } from "protractor";

import { TabHeadingAtom } from "./tab-heading.atom";
import { Atom } from "../atom";

export class TabHeadingGroupAtom extends Atom {
    public static CSS_CLASS = "nui-tab-headings__holder";

    public async getTabs(): Promise<TabHeadingAtom[]> {
        const tabsCount = await Atom.findCount(
            TabHeadingAtom,
            this.getElement()
        );
        return Array(tabsCount)
            .fill(undefined)
            .map((_, i) => Atom.findIn(TabHeadingAtom, this.getElement(), i));
    }

    public async getFirstTab(): Promise<TabHeadingAtom> {
        const tabs = await this.getTabs();
        return tabs[0];
    }

    public async getLastTab(): Promise<TabHeadingAtom> {
        const tabs = await this.getTabs();
        return tabs[tabs.length - 1];
    }

    public async getTabByText(text: string): Promise<TabHeadingAtom> {
        text = text.toUpperCase();
        const tabs = await this.getTabs();
        for (const tab of tabs) {
            if ((await tab.getText()) === text) {
                return tab;
            }
        }
        throw new Error(`No Tab Found by text ${JSON.stringify(text)}`);
    }

    public async clickCaretLeft(times: number = 1): Promise<void> {
        while (times > 0) {
            await this.getCaretLeft().click();
            times--;
        }
    }

    public async clickCaretRight(times: number = 1): Promise<void> {
        while (times > 0) {
            await this.getCaretRight().click();
            times--;
        }
    }

    public async caretsPresent(): Promise<boolean> {
        const caretLeft = this.getCaretLeft();
        const caretRight = this.getCaretRight();
        return (await caretLeft.isPresent()) && (await caretRight.isPresent());
    }

    public async getNumberOfTabs(): Promise<number> {
        return Atom.findCount(TabHeadingAtom, this.getElement());
    }

    public async getActiveTab(): Promise<TabHeadingAtom> {
        const tabs = await this.getTabs();
        for (const tab of tabs) {
            if (await tab.isActive()) {
                return tab;
            }
        }
        throw new Error("No Active Tab Found");
    }

    private getCaretLeft(): ElementFinder {
        return this.getElement().element(by.className("btn-caret-left"));
    }

    private getCaretRight(): ElementFinder {
        return this.getElement().element(by.className("btn-caret-right"));
    }
}
