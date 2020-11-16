import { Component } from "@angular/core";


@Component({
    selector: "nui-disabled-radio-group-example",
    templateUrl: "./disabled-radio-group.example.component.html",
})
export class DisabledRadioGroupExampleComponent {
    public fruits = [$localize `Banana`, $localize `Orange`, $localize `Kiwi`, $localize `Papaya`];
    public selectedFruit: string;

    constructor() { }
}
