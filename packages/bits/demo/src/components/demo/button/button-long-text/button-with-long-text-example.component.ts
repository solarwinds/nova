import { Component } from "@angular/core";

@Component({
    selector: "nui-with-button-long-text-example",
    templateUrl: "./button-with-long-text-example.component.html",
})
export class ButtonWithLongTextExampleComponent {
    public disableWidthRestriction = true;

    public toggleWidthRestriction() {
         this.disableWidthRestriction = !this.disableWidthRestriction;
    }
}
