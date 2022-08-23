import { Component } from "@angular/core";

@Component({
    selector: "textbox-visual-test",
    templateUrl: "./textbox-visual-test.component.html",
})
export class TextboxVisualTestComponent {
    public isRequired = true;
    public value = "";

    public isInErrorState() {
        return this.isRequired && !this.value;
    }

    public textChanged($event: string) {
        this.value = $event;
    }
}
