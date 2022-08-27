import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import _cloneDeep from "lodash/cloneDeep";

import { ISelectChangedEvent, ISelectGroup, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-test",
    templateUrl: "./combobox-test.component.html",
})
export class ComboboxTestComponent implements OnInit {
    public myForm: FormGroup;
    public dataset = [
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
        "Item 11",
        "Item 12",
        "Item 13",
        "Item 14",
        "Item 15",
    ];
    public displayValueDataset = [
        { value: "Value 1", name: "Item 1" },
        { value: "Value 2", name: "Item 2" },
        { value: "Value 3", name: "Item 3" },
        { value: "Value 4", name: "Item 4" },
        { value: "Value 5", name: "Item 5" },
    ];
    public reactiveFormDataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "Item 2",
    };
    public requiredDataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "",
    };
    public separatorsDataset = {
        itemsInGroups: [
            {
                header: `Group 1 header`,
                items: [`Item 111`, `Item 211`, `Item 311`],
            },
            {
                header: `Group 2 header`,
                items: [`Item 112`, `Item 212`, `Item 312`],
            },
            {
                header: `Group 3 header`,
                items: [`Item 113`, `Item 213`, `Item 313`],
            },
        ],
    };
    public typeaheadDataset: ISelectGroup[] = [
        {
            header: "Group 1 header",
            items: [
                { label: "Item 111", value: "Value 1" },
                { label: "Item 112", value: "Value 2" },
                { label: "Item 123", value: "Value 3" },
            ],
        },
        {
            header: "Group 2 header",
            items: [
                { label: "Item 111", value: "Value 5" },
                { label: "Item 212", value: "Value 6" },
                { label: "Item 312", value: "Value 7" },
            ],
        },
        {
            header: "Group 3 header",
            items: [
                { label: "Item 456", value: "Value 7" },
                { label: "Item 345", value: "Value 8" },
                { label: "Item 414", value: "Value 9" },
            ],
        },
    ];
    public htmlDisplayedItems = [
        "<>Item 111</>",
        "<button>Button 1</button>",
        "<input type='button' value='Button 2'>",
        "<input type='text'>",
        "<p>Some paragraph</p>",
    ];
    public customTemplateItems = [
        {
            name: "item_1",
            value: "Bonobo 112",
            icon: "severity_ok",
            progress: 78,
        },
        {
            name: "item_2",
            value: "Zelda 113",
            icon: "severity_ok",
            progress: 66,
        },
        {
            name: "item_3",
            value: "Max 123",
            icon: "severity_critical",
            progress: 7,
        },
        {
            name: "item_4",
            value: "Apple 234",
            icon: "severity_ok",
            progress: 24,
        },
        {
            name: "item_5",
            value: "Quartz 124",
            icon: "severity_warning",
            progress: 89,
        },
    ];
    public typeaheadDisplayedItems = this.typeaheadDataset;
    public displayValueSelectedItem: any;
    public width: number = 500;
    public isRequired: boolean = true;
    public errorState: boolean = true;
    public separatorsDisplayedItems = this.separatorsDataset.itemsInGroups;

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public ngOnInit() {
        this.myForm = this.formBuilder.group({
            item: this.formBuilder.control(
                this.reactiveFormDataset.selectedItem,
                [Validators.required]
            ),
        });

        this.myForm.controls["item"].valueChanges.subscribe((value) =>
            console.log(value)
        );
        this.isInErrorState();
    }

    public requiredValueChange(
        changedEvent: ISelectChangedEvent<string>
    ): void {
        this.requiredDataset.selectedItem = changedEvent.newValue;
        this.isInErrorState();
    }

    public separatorsTextboxChanged(searchQuery: ISelectChangedEvent<string>) {
        this.separatorsDisplayedItems = _cloneDeep(
            this.separatorsDataset.itemsInGroups
        );
        this.separatorsDisplayedItems.forEach((items) => {
            items.items = items.items.filter((item) =>
                item.includes(searchQuery.newValue)
            );
        });
    }

    public isInErrorState(): void {
        this.errorState =
            this.isRequired &&
            (!this.requiredDataset.selectedItem ||
                !(
                    this.requiredDataset.items.indexOf(
                        this.requiredDataset.selectedItem
                    ) !== -1
                ));
    }

    public onSubmit() {
        this.myForm.valid
            ? this.toastService.success({ message: `Your form is valid!` })
            : this.toastService.error({ message: `Your form is invalid!` });
    }

    public onDisplayValueChange(changedEvent: ISelectChangedEvent<any>) {
        this.displayValueSelectedItem = changedEvent.newValue;
    }

    public typeaheadTextboxChanged(searchQuery: ISelectChangedEvent<any>) {
        this.typeaheadDisplayedItems = _cloneDeep(this.typeaheadDataset);
        this.typeaheadDisplayedItems.forEach((group) => {
            group.items = group.items.filter(
                (item) =>
                    item.label.includes(searchQuery.newValue) ||
                    item.label.includes(searchQuery.newValue.label)
            );
        });
    }

    public changeWidth(newValue: number): void {
        this.width = newValue;
    }
}
