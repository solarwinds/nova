import { Component, Input } from "@angular/core";

@Component({
    selector: "nui-switch-simple-example",
    templateUrl: "./switch-simple.example.component.html",
})

export class SwitchSimpleExampleComponent {
    @Input() isOn = true;
}
