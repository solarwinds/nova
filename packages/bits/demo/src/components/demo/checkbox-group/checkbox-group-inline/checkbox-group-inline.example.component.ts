import { Component } from "@angular/core";

@Component({
    selector: "nui-checkbox-group-inline-example",
    templateUrl: "./checkbox-group-inline.example.component.html",
})
export class CheckboxGroupInlineExampleComponent {
    public cabbage = $localize`Cabbage`;
    public potato = $localize`Potato`;
    public tomato = $localize`Tomato`;
    public carrot = $localize`Carrot`;
    public vegetables = [this.cabbage, this.potato, this.tomato, this.carrot];
    public selectedVegetables = [this.potato, this.tomato];

    constructor() {}
}
