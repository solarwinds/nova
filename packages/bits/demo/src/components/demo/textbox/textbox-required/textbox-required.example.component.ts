import { Component } from "@angular/core";

@Component({
    selector: "nui-textbox-required-example",
    templateUrl: "./textbox-required.example.component.html",
})

export class TextboxRequiredExampleComponent {
    public isRequired = true;
    public value = "";

    public isInErrorState(): boolean {
        return this.isRequired && !this.value;
    }

    public textChanged($event: string): void {
        this.value = $event;
    }
}
