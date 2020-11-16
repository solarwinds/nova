import { by, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { BusyAtom } from "../busy/busy.atom";
import { IconAtom } from "../icon/icon.atom";

export class WizardStepAtom extends Atom {
    public static CSS_CLASS = "nui-wizard__step";

    private root = this.getElement();

    // step header
    public icon: IconAtom = Atom.findIn(IconAtom, this.root);

    // step body
    public busy: BusyAtom = Atom.findIn(BusyAtom, this.root);
    private stepTitle: ElementFinder = this.root.all(by.className("nui-wizard__step-title")).first();
    public getStepTitle = async (): Promise<string> => this.stepTitle.getText();

}

// WARNING!!!
// it will never be able to return both header and body pillars at the same time
// this atom should be split into WizardStepHeaderAtom and WizardStepBodyAtom
// Tests should operate with IWizardStep

// export interface IWizardStep {
//     header: WizardStepHeaderAtom;
//     body: WizardStepBodyAtom;
// }
