import { browser } from "protractor";
import { ILocation, WebElement } from "selenium-webdriver";

import { Atom } from "../../atom";

export class CdkDraggableItemAtom extends Atom {
    public static CSS_CLASS = "cdk-drag";

    public async mouseDown(): Promise<void> {
        await browser.actions().mouseMove(this.getElement()).perform();
        await browser.actions().mouseDown().perform();
    }

    public async mouseUp(): Promise<void> {
        await browser.actions().mouseUp().perform();
    }

    public async dragSelf(offset?: ILocation): Promise<void> {
        await browser.actions().mouseDown(this.getElement()).perform();
        await browser.actions().mouseMove(this.getElement(), offset).perform();
    }

    public async dragTo(location: WebElement | ILocation, offset?: ILocation): Promise<void> {
        await browser.actions().mouseDown(this.getElement()).perform();
        await browser.actions().mouseMove(location, offset).perform();
    }

    public async move(location: WebElement | ILocation, offset?: ILocation): Promise<void> {
        await browser.actions().mouseMove(location, offset).perform();
    }

}
