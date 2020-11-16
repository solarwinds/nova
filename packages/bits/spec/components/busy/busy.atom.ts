import { by } from "protractor";

import { Atom } from "../../atom";
import { ProgressAtom } from "../progress/progress.atom";
import { SpinnerAtom } from "../spinner/spinner.atom";


export class BusyAtom extends Atom {
    public static CSS_CLASS = "nui-nova-busy";

    private root = this.getElement();

    public isAppended = async (): Promise<boolean> => this.root.element(by.css(".nui-nova-busy__container")).isPresent();

    public isDisplayed = async (): Promise<boolean> => this.root.element(by.css(".nui-nova-busy__container")).isDisplayed();

    public isBusy = async (): Promise<boolean> => this.root.element(by.css(".nui-nova-busy__overlay")).isPresent();

    public getProgress = () => Atom.findIn(ProgressAtom, this.root);

    public getSpinner = () => Atom.findIn(SpinnerAtom, this.root);
}
