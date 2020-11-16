import { Component } from "@angular/core";

@Component({
    selector: "nui-checkbox-group-justified-example",
    templateUrl: "./checkbox-group-justified.example.component.html",
})
export class CheckboxGroupJustifiedExampleComponent {
    public cabbage = $localize `Cabbage`;
    public potato = $localize `Potato`;
    public tomato = $localize `Tomato`;
    public carrot = $localize `Carrot`;
    public vegetables = [this.cabbage, this.potato, this.tomato, this.carrot];
    public hints = [this.cabbage, this.tomato];
    public selectedVegetables = [this.potato, this.tomato];

    constructor() { }

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }
}
