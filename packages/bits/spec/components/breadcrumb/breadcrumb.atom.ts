import { browser, by, ElementArrayFinder, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class BreadcrumbAtom extends Atom {
    public static CSS_CLASS = "nui-breadcrumb";

    public getAllItems(): ElementArrayFinder {
        return super.getElement().all(by.css(".nui-breadcrumb__wrapper"));
    }

    public getItemsCount = async (): Promise<number> =>
        this.getAllItems().count();

    public getLastItem = (): ElementFinder => this.getAllItems().last();

    public getFirstItem = (): ElementFinder => this.getAllItems().first();

    public getLink = (item: ElementFinder): ElementFinder =>
        item.element(by.className("nui-breadcrumb__crumb"));

    public async getUrlState(): Promise<string> {
        const fullUrl = await browser.getCurrentUrl();
        return fullUrl.split("#")[1];
    }
}
