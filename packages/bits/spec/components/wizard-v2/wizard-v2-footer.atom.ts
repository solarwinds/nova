import { by } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../..";

export class WizardV2FooterAtom extends Atom {
    public static CSS_CLASS = "nui-wizard-horizontal-footer-container";

    private root = this.getElement();

    public getNextBtn(): ButtonAtom {
        return this.getButtonAtom(".nui-button.btn.next");
    }

    public getCancelBtn(): ButtonAtom {
        return this.getButtonAtom(".nui-button.cancel");
    }

    public getBusyBtn(): ButtonAtom {
        return this.getButtonAtom(".nui-button.busy-btn");
    }

    public getFinishButton(): ButtonAtom {
        return this.getButtonAtom(".nui-button.complete");
    }

    private getButtonAtom(query: string): ButtonAtom {
        const button = this.root.element(by.css(query));

        return new ButtonAtom(button);
    }
}
