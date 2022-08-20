import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ISelectChangedEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-select-visual",
    templateUrl: "./select-visual-test.component.html",
    styleUrls: [
        "../select-custom-template/select-custom-template.example.component.less",
    ],
})
export class SelectVisualTestComponent implements OnInit {
    public isRequired = true;
    public myForm: FormGroup;
    public datasetBasic = {
        items: [
            "Item 1",
            "Item 2",
            "Item 3",
            "Item 4",
            "Item 5",
            "Item 6",
            "Item 7",
            "Item 8",
            "Item 9",
            "Item 10",
        ],
        selectedItem: "",
    };
    public datasetDisabled = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "Item 1",
    };

    public datasetSeparator = {
        itemsInGroups: [
            {
                header: $localize`Group 1 header`,
                items: [
                    $localize`Item 1`,
                    $localize`Item 2`,
                    $localize`Item 3`,
                ],
            },
            {
                header: $localize`Group 2 header`,
                items: [
                    $localize`Item 4`,
                    $localize`Item 5`,
                    $localize`Item 6`,
                ],
            },
            {
                header: $localize`Group 3 header`,
                items: [
                    $localize`Item 7`,
                    $localize`Item 8`,
                    $localize`Item 9`,
                ],
            },
        ],
        selectedItem: $localize`Item 1`,
    };

    constructor(private formBuilder: FormBuilder) {}

    public datasetCustom = {
        displayValue: "value",
        selectedItem: "",
        items: [
            {
                name: "item_1",
                value: "Bonobo",
                icon: "severity_ok",
                progress: 78,
            },
            {
                name: "item_2",
                value: "Zelda",
                icon: "severity_ok",
                progress: 66,
            },
            {
                name: "item_3",
                value: "Max",
                icon: "severity_critical",
                progress: 7,
            },
            {
                name: "item_4",
                value: "Apple",
                icon: "severity_ok",
                progress: 24,
            },
            {
                name: "item_5",
                value: "Quartz",
                icon: "severity_warning",
                progress: 89,
            },
        ],
    };

    public ngOnInit() {
        this.myForm = this.formBuilder.group({
            item: this.formBuilder.control(this.datasetBasic.selectedItem, [
                Validators.required,
            ]),
        });
    }

    public onSubmit() {
        if (!this.myForm.valid) {
            // if form is invalid mark all controls as touched to trigger isInErrorState
            Object.keys(this.myForm.controls).forEach((field) => {
                const control = this.myForm.get(field);
                control?.markAsTouched({ onlySelf: true });
            });
        }
    }

    public valueChange(changedEvent: ISelectChangedEvent<string>) {
        this.datasetBasic.selectedItem = changedEvent.newValue;
    }

    public isInErrorState() {
        return this.isRequired && !this.datasetBasic.selectedItem;
    }
}
