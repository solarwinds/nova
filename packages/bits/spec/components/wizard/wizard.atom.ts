import { by, ElementFinder } from "protractor";
import { ISize } from "selenium-webdriver";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { WizardStepAtom } from "../wizard/wizard-step.atom";

export class WizardAtom extends Atom {
    public static CSS_CLASS = "nui-wizard";

    private root = this.getElement();

    public backButton = new ButtonAtom(this.root.element(by.className("nui-wizard__back-button")));
    public nextButton = new ButtonAtom(this.root.element(by.className("nui-wizard__next-button")));
    public finishButton = new ButtonAtom(this.root.element(by.className("nui-wizard__finish-button")));
    public cancelButton = new ButtonAtom(this.root.element(by.className("nui-wizard__cancel-button")));

    public back = (): Promise<void> => this.backButton.click();

    public cancel = (): Promise<void> => this.cancelButton.click();

    public finish = (): Promise<void> => this.finishButton.click();

    public getHeader = (): ElementFinder => this.root.element(by.css(".nui-wizard__header"));

    public getActiveStep = (): ElementFinder => this.root.element(by.css(".nui-wizard__header-step--active"));

    public next = (): Promise<void> => this.nextButton.click();

    public async getHeaderSteps(): Promise<{}[]> {
        const stepsEl = this.root.element(by.className("nui-wizard__header-steps"));

        return stepsEl.all(by.className("nui-wizard__header-step")).map(async (el?: ElementFinder) => {
            if (!el) {
                throw new Error("elementFinder is not defined");
            }
            return el.all(by.className("nui-wizard__header-step-title")).first().getText();
        });
    }

    public async getSteps() {
        const stepsEl = this.root.element(by.className("nui-wizard__header"));

        // this should really be a map operation.  However, map has a bug- if you put an element finder
        // in it, it will try to resolve EVERYTHING, and causes node to go into an infinite loop
        return stepsEl.all(by.className("nui-wizard__header-step-container"))
            .reduce((accumulator: WizardStepAtom[], el: ElementFinder) => {
                accumulator.push(new WizardStepAtom(el));
                return accumulator;
            }, []);
    }

    public async getContainerHeight(): Promise<number> {
        return this.root.element(by.className("nui-wizard__container"))
            .getSize().then((elemSize: ISize) => elemSize.height);
    }

    public async goToStep(index: number): Promise<void> {
        return this.root.all(by.className("nui-wizard__header-step")).get(index).click();
    }
}
