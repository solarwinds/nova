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

import { Atom } from "../../atom";
import { TabHeadingAtom } from "./tab-heading.atom";

export class TabHeadingGroupAtom extends Atom {
    public static CSS_CLASS = "nui-tab-headings__holder";

    public async getTabs() {
        const tabsCount: number = await Atom.findCount(
            TabHeadingAtom,
            this.getElement()
        );
        const tabs = [];
        for (let i = 0; i < tabsCount; i++) {
            tabs.push(Atom.findIn(TabHeadingAtom, this.getElement(), i));
        }
        return tabs;
    }

    public async getFirstTab(): Promise<TabHeadingAtom> {
        const tabs = await this.getTabs();
        return tabs[0];
    }

    public async getLastTab(): Promise<TabHeadingAtom> {
        const tabs = await this.getTabs();
        return tabs[tabs.length - 1];
    }

    public async getTabByText(text: string) {
        const tabs = await this.getTabs();
        const tab: TabHeadingAtom[] = [];

        for (let i = 0; i < tabs.length; i++) {
            if ((await tabs[i].getText()) === text.toUpperCase()) {
                tab.push(tabs[i]);
            }
        }
        return tab[0];
    }

    public async clickCaretLeft(times: number = 1) {
        while (times > 0) {
            await this.getCaretLeft().click();
            times--;
        }
    }

    public async clickCaretRight(times: number = 1) {
        while (times > 0) {
            await this.getCaretRight().click();
            times--;
        }
    }

    public async caretsPresent() {
        const caretLeft = this.getCaretLeft();
        const caretRight = this.getCaretRight();
        return (await caretLeft.isPresent()) && (await caretRight.isPresent());
    }

    public getNumberOfTabs = async (): Promise<number> =>
        Atom.findCount(TabHeadingAtom, this.getElement());

    public getActiveTab = async () => {
        const tabs = await this.getTabs();

        for (let i = 0; i < tabs.length; i++) {
            if (await tabs[i].isActive()) {
                return tabs[i];
            }
        }
    };

    private getCaretLeft(): ElementFinder {
        return this.getElement().element(by.className("btn-caret-left"));
    }

    private getCaretRight(): ElementFinder {
        return this.getElement().element(by.className("btn-caret-right"));
    }
}
