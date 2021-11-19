import { Component } from "@angular/core";

@Component({
    selector: "nui-set-focus-example",
    templateUrl: "./set-focus.example.component.html",
})
export class SetFocusExampleComponent {
    public choiceState = "carrot";
    public carrotFocused = false;
    public onionFocused = false;
    private interval = 2000;

    public updateChoiceState(event: any): void {
        this.choiceState = event;
    }

    public setCarrotFocus(): void {
        this.carrotFocused = true;
        setTimeout(() => {
            this.carrotFocused = false;
        }, this.interval);
    }

    public setOnionFocus(): void {
        this.onionFocused = true;
        setTimeout(() => {
            this.onionFocused = false;
        }, this.interval);
    }
}
