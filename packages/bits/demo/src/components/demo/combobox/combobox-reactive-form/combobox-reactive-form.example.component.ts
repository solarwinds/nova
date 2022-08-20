import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-reactive-form",
    templateUrl: "./combobox-reactive-form.example.component.html",
})
export class ComboboxReactiveFormExampleComponent implements OnInit {
    public myForm: FormGroup;
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "Item 2",
    };

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public ngOnInit() {
        this.myForm = this.formBuilder.group({
            item: this.formBuilder.control(this.dataset.selectedItem, [
                Validators.required,
            ]),
        });

        this.myForm.controls["item"].valueChanges.subscribe((value) =>
            console.log(value)
        );
    }

    public onSubmit() {
        this.myForm.valid
            ? this.toastService.success({ message: "Your form is valid!" })
            : this.toastService.error({ message: `Your form is invalid!` });
    }
}
