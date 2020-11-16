import { Atom, ButtonAtom, SearchAtom } from "@solarwinds/nova-bits/sdk/atoms";
import { browser, by, element } from "protractor";

import { Helper } from "../helper";

import { LoginPage } from "./login.po";

export class AppPage {

    public loginButton: ButtonAtom;
    public logoutButton: ButtonAtom;
    public registerButton: ButtonAtom;
    public askQuestionButton: ButtonAtom;
    public searchBox: SearchAtom;

    constructor() {
        this.loginButton = Atom.findIn(ButtonAtom, element(by.css(".rd-app__login-button")));
        this.logoutButton = Atom.findIn(ButtonAtom, element(by.css(".rd-app__logout-button")));
        this.registerButton = Atom.findIn(ButtonAtom, element(by.id("nui-demo-default-dialog-btn")));
        this.askQuestionButton = Atom.findIn(ButtonAtom, element(by.css(".rd-app__add-question")));
        this.searchBox = Atom.findIn(SearchAtom, element(by.css(".rd-app__search")));
    }

    async navigateTo(): Promise<any> {
        return await browser.get("/");
    }

    async getHeaderText(): Promise<string> {
        return await element(by.css(".rd-app__page-header .nui-text-page")).getText();
    }

    async logIn(username: string, password: string) {
        await this.loginButton.click();

        await Helper.waitForUrl("/login");
        const loginPage = new LoginPage();

        await loginPage.logIn(username, password);
    }

    async search(query: string) {
        await this.searchBox.acceptInput(query);
        await this.searchBox.getSearchButton().click();

        await browser.waitForAngular();
    }

    async isLoggedIn(): Promise<boolean> {
        return !(await this.loginButton.getElement().isPresent()) && await this.logoutButton.getElement().isPresent();
    }

    async getUsername(): Promise<string> {
        if (!(await this.logoutButton.getElement().isPresent())) {
            throw new Error("The user is not logged in!");
        }
        return await this.logoutButton.getText();
    }

    async isLoggedOut(): Promise<boolean> {
        return !(await this.isLoggedIn());
    }

    async logOut() {
        await this.logoutButton.click();
        return await browser.wait(() => this.isLoggedOut(), Helper.BROWSER_WAIT_TIMEOUT);
    }

}
