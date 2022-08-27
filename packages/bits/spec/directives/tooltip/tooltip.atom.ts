import { browser, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";

export class TooltipAtom extends Atom {
    public static CSS_CLASS = "nui-tooltip-body";
    public static animationDuration = 200; // packages\bits\src\animations\fadeIn.ts#10

    private root = this.getElement();

    public waitToBeDisplayed = async (
        delay: number = TooltipAtom.animationDuration * 1.5
    ): Promise<void> =>
        browser.wait(ExpectedConditions.visibilityOf(this.root), delay);

    public isTooltipDisplayed = async (): Promise<boolean> => this.isPresent();

    public getTooltipText = async (): Promise<string> => this.root.getText();
}
