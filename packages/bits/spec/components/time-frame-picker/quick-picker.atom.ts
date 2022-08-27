import { browser, by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class QuickPickerAtom extends Atom {
    public static CSS_CLASS = "nui-quick-picker";

    public selectPresetByTitle = async (title: string): Promise<void> =>
        this.getPresetByName(title).click();

    public hoverPresetByTitle = async (title: string): Promise<void> =>
        browser.actions().mouseMove(this.getPresetByName(title)).perform();

    public async getSelectedPreset(): Promise<string | null> {
        const selectedElement = this.getElement().element(
            by.className("nui-quick-picker__preset--selected")
        );
        return (await selectedElement.isPresent())
            ? await selectedElement.getText()
            : null;
    }

    private getPresetByName(title: string): ElementFinder {
        return this.getElement()
            .all(by.className("nui-quick-picker__preset"))
            .filter(
                async (elem: ElementFinder) => (await elem.getText()) === title
            )
            .get(0);
    }
}
