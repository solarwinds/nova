import { Component } from "@angular/core";

@Component({
    selector: "nui-textbox-required-example",
    templateUrl: "./textbox-required.example.component.html",
})

export class TextboxRequiredExampleComponent {
    public isRequired = true;
    public value = "";

    public isInErrorState() {
        return this.isRequired && !this.value;
    }

    public textChanged($event: string) {
        this.value = $event;
    }
}
