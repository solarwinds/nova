import { Component } from "@angular/core";


@Component({
    selector: "nui-radio-group-inline-example",
    templateUrl: "./radio-group-inline.example.component.html",
})
export class RadioGroupInlineExampleComponent {
    public fruits = [$localize `Banana`, $localize `Orange`, $localize `Kiwi`, $localize `Papaya`];
    public selectedFruit: string;

    constructor() { }
}
