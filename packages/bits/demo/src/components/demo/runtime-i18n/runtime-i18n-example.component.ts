import { Component } from "@angular/core";

@Component({
    selector: "nui-runtime-i18n-example",
    templateUrl: "./runtime-i18n-example.component.html",
})
export class RuntimeI18NExampleComponent {
    public firstNamePlaceholder: string = `John`;
    public lastNamePlaceholder: string = `Doe`;
    public email: string = `john.doe@whatever.com`;

    private pageReload() {
        window.location.reload();
    }

    public setLocale(locale: string) {
        localStorage.setItem("locale", locale);
        this.pageReload();
    }

    public setDefaultLocale() {
        localStorage.removeItem("locale");
        this.pageReload();
    }
}
