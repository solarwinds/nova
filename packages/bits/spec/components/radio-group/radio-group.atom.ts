import { by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class RadioGroupAtom extends Atom {
    public static CSS_CLASS = "nui-radio-group";

    public async getValue(): Promise<string> {
        return this.getElement().element(by.css("input:checked")).getAttribute("value");
    }

    // Finds and returns label element (clickable wrapper of radio button input element),
    // because actual input element is hidden with "appearance: none" and is not clickable
    public getRadioByValue(value: string): ElementFinder {
        return this.getElement().element(by.css(`input[value="${value}"]`)).element(by.xpath("../.."));
    }

    // Finds and returns radio button input element
    public getRadioInputByValue(value: string): ElementFinder {
        return this.getElement().element(by.css(`input[value="${value}"]`));
    }

    public async getHelpHintText(index: number): Promise<string> {
        return this.getElement().all(by.css(".nui-help-hint")).get(index).getText();
    }

    public async getNumberOfItems(): Promise<number> {
        return this.getElement().all(by.css(".nui-radio")).count();
    }

    public getFirst(): ElementFinder {
        return this.getElement().all(by.css(".nui-radio")).first();
    }

    public async getNumberOfDisabledItems(): Promise<number> {
        return this.getElement().all(by.css(".nui-radio__input[disabled]")).count();
    }

    public async isRadioSelected(value: string): Promise<boolean> {
        return this.getRadioInputByValue(value).isSelected();
    }
}
