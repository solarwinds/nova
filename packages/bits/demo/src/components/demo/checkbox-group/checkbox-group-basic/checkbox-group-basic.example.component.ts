import { Component } from "@angular/core";
import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-checkbox-group-basic-example",
    templateUrl: "./checkbox-group-basic.example.component.html",
})
export class CheckboxGroupBasicExampleComponent {
    public cabbage = $localize`Cabbage`;
    public potato = $localize`Potato`;
    public tomato = $localize`Tomato`;
    public carrot = $localize`Carrot`;
    public vegetables = [this.cabbage, this.potato, this.tomato, this.carrot];
    public selectedVegetables = [this.potato, this.tomato];

    constructor(private toastService: ToastService) { }

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }

    public onValueChange(event: any): void {
        this.toastService.success({ message: $localize`Selected checkboxes: ` + event });
    }

}
