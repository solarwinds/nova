import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: "nui-runtime-i18n-example",
    templateUrl: "./runtime-i18n-example.component.html",
})
export class RuntimeI18NExampleComponent implements OnDestroy {
    public firstNamePlaceholder: string = `John`;
    public lastNamePlaceholder: string = `Doe`;
    public email: string = `john.doe@whatever.com`;

    private pageReload(): void {
        window.location.reload();
    }

    public setLocale(locale: string): void {
        localStorage.setItem("locale", locale);
        this.pageReload();
    }

    public setDefaultLocale(): void {
        localStorage.removeItem("locale");
        this.pageReload();
    }

    public ngOnDestroy(): void {
        localStorage.removeItem("locale");
    }
}
