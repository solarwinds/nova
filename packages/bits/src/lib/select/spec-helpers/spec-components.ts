import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToastService } from "../../toast/toast.service";
import { ISelectChangedEvent } from "../public-api";

/**
 * @ignore
 */
@Component({
    template: `
        <form [formGroup]="myForm" (submit)="onSubmit()">
            <div class="form-group">
                <nui-select placeholder="Select item"
                            id="nui-demo-basic-select-reactive-form"
                            formControlName="item"
                            [itemsSource]="dataset.items"
                            (changed)="valueChange($event)"></nui-select>
                <button nui-button
                        type="submit"
                        class="mt-1">Submit</button>
            </div>
        </form>
    `,
})
export class SelectReactiveFormTestComponent implements OnInit {
    public myForm: FormGroup;
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "",
    };

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ToastService) public toastService: ToastService
    ) { }

    public ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            item: this.formBuilder.control(this.dataset.selectedItem, [Validators.required]),
        });
    }

    public valueChange(changedEvent: ISelectChangedEvent<string>): void {
        this.dataset.selectedItem = changedEvent.newValue;
    }

    public onSubmit(): void {
        this.myForm.valid
            ? this.toastService.success({ message: "Your form is valid!" })
            : this.toastService.error({ message: "Your form is invalid!" });
    }
}

/**
 * @ignore
 */
@Component({
    template: `
        <form [formGroup]="myForm" (submit)="onSubmit()">
            <div class="form-group">
                <nui-combobox id="nui-demo-combobox-reactive-form"
                              formControlName="item"
                              [itemsSource]="dataset.items"
                              placeholder="Select item" required></nui-combobox>
                <button nui-button
                        type="submit"
                        class="mt-1">Submit</button>
            </div>
        </form>
    `,
})
export class ComboboxReactiveFormTestComponent implements OnInit {
    public myForm: FormGroup;
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "",
    };

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ToastService) public toastService: ToastService
    ) { }

    public ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            item: this.formBuilder.control(this.dataset.selectedItem, [Validators.required]),
        });
    }

    public onSubmit(): void {
        this.myForm.valid ? this.toastService.success({ title: "Your form is valid!" }) :
            this.toastService.error({ title: "Your form is invalid!" });
    }
}
