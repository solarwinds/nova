import { by } from "protractor";
import { ElementArrayFinder, ElementFinder } from "protractor/built/element";

import { Atom } from "../../atom";

export class ChipsAtom extends Atom {
    public static CSS_CLASS = "nui-chips";
    public static verticalClass = "nui-chips__vertical";
    public static qtyLabelClass = "nui-chips__count";
    public static itemClass = "nui-chip__value";
    public static itemNameClass = "nui-chip__value-name";
    public static itemRemoveIconClass = "nui-chip__value-remove";
    public static groupNameClass = "nui-chips__group-name";
    public static clearAllLinkClass = "nui-chips__clear";
    public static chipsoverflowedClass = "nui-chips-overflowed__counter";

    private root: ElementFinder = this.getElement();
    private groups: ElementArrayFinder = this.root.all(by.className(ChipsAtom.groupNameClass));

    public async isVertical(): Promise<boolean> { return super.hasClass(ChipsAtom.verticalClass); }

    public getChipElements = (): ElementArrayFinder => this.root.all(by.className(ChipsAtom.itemClass));

    public getChipsCount = async (): Promise<number> => this.getChipElements().count();

    public getChipElement = (index: number): ElementFinder => this.getChipElements().get(index);

    public getChipName = async (element: ElementFinder): Promise<string> => element.all(by.className(ChipsAtom.itemNameClass)).first().getText();

    public getChipsNames = async (): Promise<string[]> => this.getChipElements().map(async(el) => {
        if (!el) {
            throw new Error("elementFinder is not defined");
        }

        return await this.getChipName(el);
    })

    public getChipsGroupNames = async (): Promise<string[]> => this.groups.map(async(el) => {
        if (!el) {
            throw new Error("elementFinder is not defined");
        }
        return await this.getGroupName(el);
    })

    public getGroupsCount = async (): Promise<number> => this.groups.count();

    public getGroupName = async (element: ElementFinder): Promise<string> => element.getText();

    public removeItem = async (index: number): Promise<void> => this.root.all(by.className(ChipsAtom.itemRemoveIconClass)).get(index).click();

    public getClearAllLinkElement = (): ElementFinder => this.root.element(by.className(ChipsAtom.clearAllLinkClass));

    public clearAll = async (): Promise<void> => this.getClearAllLinkElement().click();

    public isVisible = async (): Promise<boolean> => await this.isPresent() && await this.isDisplayed();

    public async getChipsQuantityFromLabel(): Promise<number> {
        const t = await this.root.element(by.className(ChipsAtom.qtyLabelClass)).getText();
        return +t.slice(1, -1);
    }

    public click = async (): Promise<void> => this.getElement().click();

    public getChipsOverflowElement = (): ElementFinder => this.root.element(by.className(ChipsAtom.chipsoverflowedClass));

    public getChipsOverflowCounter = async (): Promise<string> => this.getChipsOverflowElement().getText();
}
