import { by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

import { TabHeadingAtom } from "./tab-heading.atom";

export class TabHeadingGroupAtom extends Atom {
    public static CSS_CLASS = "nui-tab-headings__holder";

    public async getTabs(): Promise<TabHeadingAtom[]> {
        const tabsCount: number = await Atom.findCount(TabHeadingAtom, this.getElement());
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

    public async getTabByText(text: string): Promise<TabHeadingAtom> {
        const tabs = await this.getTabs();
        const tab: TabHeadingAtom[] = [];

        for (let i = 0; i < tabs.length; i++) {
            if (await tabs[i].getText() === text.toUpperCase()) {
                tab.push(tabs[i]);
            }
        }
        return tab[0];
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

    public getNumberOfTabs = async (): Promise<number> => Atom.findCount(TabHeadingAtom, this.getElement());

    public getActiveTab = async (): Promise<TabHeadingAtom | undefined> => {
        const tabs = await this.getTabs();

        for (let i = 0; i < tabs.length; i++) {
            if (await tabs[i].isActive()) {
                return tabs[i];
            }
        }
    }

    private getCaretLeft(): ElementFinder {
        return this.getElement().element(by.className("btn-caret-left"));
    }

    private getCaretRight(): ElementFinder {
        return this.getElement().element(by.className("btn-caret-right"));
    }
}
