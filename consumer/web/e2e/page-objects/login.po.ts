import { Atom, ButtonAtom, TextboxAtom } from "@solarwinds/nova-bits/sdk/atoms";
import { browser, by, element } from "protractor";

export class LoginPage {

    private usernameTextbox: TextboxAtom;
    private passwordTextbox: TextboxAtom;
    private submitButton: ButtonAtom;

    constructor() {
        this.usernameTextbox = Atom.findIn(TextboxAtom, element(by.className("rd-login__username")));
        this.passwordTextbox = Atom.findIn(TextboxAtom, element(by.className("rd-login__password")));
        this.submitButton = Atom.findIn(ButtonAtom, element(by.className("rd-login__submit")));
    }

    async navigateTo() {
        browser.get("/login");
    }

    async logIn(username: string, password: string): Promise<void> {
        await this.usernameTextbox.acceptText(username);
        await this.passwordTextbox.acceptText(password);
        await this.submitButton.click();
    }

}
