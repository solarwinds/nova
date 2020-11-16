import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ISelectChangedEvent, ToastService } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-select-reactive-form",
    templateUrl: "./select-reactive-form.example.component.html",
})
export class SelectReactiveFormExampleComponent implements OnInit {
    public myForm: FormGroup;
    public dataset = {
        items: [$localize `Item 1`, $localize `Item 2`, $localize `Item 3`, $localize `Item 4`, $localize `Item 5`],
        selectedItem: "",
    };

    constructor(private formBuilder: FormBuilder,
        @Inject(ToastService) private toastService: ToastService) { }

    public ngOnInit() {
        this.myForm = this.formBuilder.group({
            item: this.formBuilder.control( this.dataset.selectedItem, [Validators.required]),
        });
        this.myForm.controls["item"].valueChanges.subscribe(value => console.log("Value changed to", value));
    }

    public valueChange(changedEvent: ISelectChangedEvent<string>) {
        this.dataset.selectedItem = changedEvent.newValue;
    }

    public onSubmit() {
        if (this.myForm.valid) {
            this.toastService.success({message: $localize `Your form is valid!`});
        } else {
            // if form is invalid mark all controls as touched to trigger isInErrorState
            Object.keys(this.myForm.controls).forEach(field => {
                const control = this.myForm.get(field);
                control?.markAsTouched({onlySelf: true});
            });
            this.toastService.error({message: $localize `Your form is invalid!`});
        }
    }
}
