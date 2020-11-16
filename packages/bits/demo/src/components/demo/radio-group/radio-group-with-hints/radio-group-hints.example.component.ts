import { Component } from "@angular/core";


@Component({
    selector: "nui-with-hints-radio-group-example",
    templateUrl: "./radio-group-hints.example.component.html",
})
export class RadioGroupHintsExampleComponent {
    public colors = [$localize `Red`, $localize `Green`, $localize `Blue`];
    public colorHints = { "Red": $localize `hot color`, "Green": $localize `color of nature`, "Blue": $localize `color of sky` };
    public selectedColor: string;

    constructor() { }
}
