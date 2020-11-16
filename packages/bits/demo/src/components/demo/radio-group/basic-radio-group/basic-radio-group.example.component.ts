import { Component } from "@angular/core";


@Component({
    selector: "nui-basic-radio-group-example",
    templateUrl: "./basic-radio-group.example.component.html",
})
export class BasicRadioGroupExampleComponent {
    public fruits = [$localize `Banana`, $localize `Orange`, $localize `Kiwi`, $localize `Papaya`];
    public selectedFruit: string;

    constructor() { }
}
