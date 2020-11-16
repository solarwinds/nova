import { Component } from "@angular/core";

@Component({
    selector: "nui-button-test",
    templateUrl: "./button-test.component.html",
})
export class ButtonTestComponent {
    isRepeat = "true";
    count = 100;

    onCountUpClick() {
        this.count++;
    }
}
