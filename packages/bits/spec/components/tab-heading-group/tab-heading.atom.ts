import { Atom } from "../../atom";

export class TabHeadingAtom extends Atom {
    public static CSS_CLASS = "nui-tab-heading";

    public click = async (times: number = 1) => {
        while (times > 0) {
            await this.getElement().click();
            times--;
        }
    };

    public isDisabled = async () =>
        Atom.hasClass(this.getElement(), "disabled");

    public isActive = async () => Atom.hasClass(this.getElement(), "active");

    public getText = async () => this.getElement().getText();
}
