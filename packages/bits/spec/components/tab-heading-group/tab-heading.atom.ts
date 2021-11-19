import { Atom } from "../../atom";

export class TabHeadingAtom extends Atom {
    public static CSS_CLASS = "nui-tab-heading";

    public click = async (times: number = 1): Promise<void> => {
        while (times > 0) {
            await this.getElement().click();
            times--;
        }
    }

    public isDisabled = async (): Promise<boolean> => Atom.hasClass(this.getElement(), "disabled");

    public isActive = async (): Promise<boolean> => Atom.hasClass(this.getElement(), "active");

    public getText = async (): Promise<string> => this.getElement().getText();

}
