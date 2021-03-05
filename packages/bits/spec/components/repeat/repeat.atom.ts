import { by, ElementArrayFinder, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";

export class RepeatAtom extends Atom {
    public static CSS_CLASS = "nui-repeat";

    public getItems(): ElementArrayFinder { return super.getElement().all(by.css(".repeat-group-item")); }

    public itemCount = async (): Promise<number> => this.getItems().count();

    public getItem = (idx: number): ElementFinder => this.getItems().get(idx);

    public isNormal = (): Promise<boolean> => this.hasClass("nui-repeat__normal");

    public isCompact = (): Promise<boolean> => this.hasClass("nui-repeat__compact");

    public get vScrollViewport(): ElementFinder {
        return super.getElement().element(by.className("cdk-virtual-scroll-viewport"));
    }

    public get vScrollViewportContent(): ElementFinder {
        return super.getElement().element(by.className("cdk-virtual-scroll-content-wrapper"));
    }

    public selectCheckbox = async (idx: number): Promise<void> =>
        this.getItem(idx).element(by.className("nui-checkbox")).click()

    public getCheckbox = (idx: number): CheckboxAtom => {
        const checkboxElement = this.getItem(idx).element(by.className("nui-checkbox"));
        return new CheckboxAtom(checkboxElement);
    }

    public selectRow = async (idx: number): Promise<void> =>
        this.getItem(idx).element(by.css(".nui-repeat-item__content")).click()

    public selectRadioRow = async (idx: number): Promise<void> =>
        this.getItem(idx).element(by.css(".nui-repeat-item")).click()

    public isStriped = async (): Promise<boolean> => {
        const items = this.getItems();
        return items.first().getCssValue("background-color").then((lineOneColor: string) =>
            items.get(1).getCssValue("background-color").then((lineTwoColor: string) =>
                lineOneColor !== lineTwoColor));
    }

    public isItemSelected = async (idx: number): Promise<boolean> =>
        this.getItem(idx)
            .element(by.css("li.nui-repeat-item"))
            .getAttribute("class")
            .then((classValue: string) => !!(classValue && classValue.indexOf("nui-repeat-item--selected") >= 0))

    public async isEmptyTextPresented(): Promise<boolean> {
        return super.getElement().element(by.css(".nui-repeat__empty .nui-repeat__empty--main-message")).isPresent();
    }

    public async getEmptyText(): Promise<string> {
        return super.getElement().element(by.css(".nui-repeat__empty .nui-repeat__empty--main-message")).getText();
    }

    public async getHeaderText(): Promise<string> {
        return super.getElement().element(by.css(".nui-repeat-header")).getText();
    }

    public async getVScrollViewportHeight(): Promise<string> {
        return this.vScrollViewport.getCssValue("height");
    }

    public async getVScrollViewportContentHeight(): Promise<string> {
        return this.vScrollViewportContent.getCssValue("height");
    }
}
