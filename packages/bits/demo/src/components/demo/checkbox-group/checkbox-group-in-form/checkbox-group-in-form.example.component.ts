import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-checkbox-group-in-form-example",
    templateUrl: "./checkbox-group-in-form.example.component.html",
})
export class CheckboxGroupInFormExampleComponent implements OnInit {
    public myForm: FormGroup;
    public cabbage = $localize`Cabbage`;
    public potato = $localize`Potato`;
    public tomato = $localize`Tomato`;
    public carrot = $localize`Carrot`;
    public vegetables = [this.cabbage, this.potato, this.tomato, this.carrot];
    public selectedVegetables = [this.cabbage];

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService
    ) { }

    public ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            checkboxGroup: this.formBuilder.control([this.cabbage, this.potato], [
                Validators.required, Validators.minLength(3)]),
        });
    }

    public onSubmit(): void {
        console.log(this.myForm);
        this.toastService.success({ message: $localize`Your form is valid!` });
    }

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }
}
