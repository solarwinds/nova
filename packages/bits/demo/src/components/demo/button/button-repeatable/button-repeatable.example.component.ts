import { Component } from "@angular/core";

@Component({
    selector: "nui-button-repeatable-example",
    templateUrl: "./button-repeatable.example.component.html",
})
export class ButtonRepeatableExampleComponent {
    count = 100;

    onCountUpClick(): void {
        this.count++;
    }

    onCountDownClick(): void {
        this.count--;
    }
}
