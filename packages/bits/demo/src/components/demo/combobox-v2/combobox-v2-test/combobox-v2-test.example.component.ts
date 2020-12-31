import { OverlayConfig } from "@angular/cdk/overlay";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ComboboxV2Component, DialogService, NuiDialogRef, OVERLAY_WITH_POPUP_STYLES_CLASS, ToastService } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

interface IExampleItem {
    id: string;
    name: string;
    icon?: string;
    disabled?: boolean;
}

@Component({
    selector: "nui-combobox-v2-test-example",
    templateUrl: "combobox-v2-test.example.component.html",
    styleUrls: ["combobox-v2-test.example.component.less"],
    host: { class: "combobox-container" },
})
export class ComboboxV2TestExampleComponent implements OnInit {
    private activeDialog: NuiDialogRef;
    // Testing only
    public overlayConfig: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS, "combobox-v2-test-pane"],
    };

    // Data
    public options = Array.from({ length: 3 }).map((_, i) => $localize `Item ${i}`);
    public optionsMulti: IExampleItem[] = Array.from({ length: 3 }).map((_, i) =>
            ({
                id: `value-${i}`,
                name: $localize `Item ${i}`,
                disabled: i % 2 ? true : false,
            }));
    public optionsMultiDimensions = this.getOptions(50, false);
    public items = Array.from({ length: 100 }).map((_, i) => $localize `Item ${i}`);
    public selectedItem: IExampleItem;
    public selectedSingleItem: IExampleItem;
    public isComboboxDisabled = false;

    public dataset = {
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
            "Item 11",
            "Item 12",
            "Item 13",
            "Item 14",
            "Item 15",
            "Item 16",
            "Item 17",
            "Item 18",
            "Item 19",
            "Item 20",
        ],
    };

    // Form
    public error: boolean = true;
    public comboboxControl = new FormControl();
    public comboboxControlSingle = new FormControl();
    public comboboxControlMulti = new FormControl();
    public fancyForm: FormGroup;

    public closePopoverSubject: Subject<void> = new Subject<void>();

    private destroy$: Subject<any> = new Subject<any>();

    @ViewChild("comboboxSingle") public comboboxSingle: ComboboxV2Component;
    @ViewChild("comboboxMultiDimensions") public comboboxMultiDimensions: ComboboxV2Component;

    constructor(private formBuilder: FormBuilder, private dialogService: DialogService, private toastService: ToastService) {}

    public closePopover() {
        this.closePopoverSubject.next();
    }

    public createOption(option: string) {
        this.options.push(option);
        this.comboboxControlSingle.setValue(option);
    }

    public createOptionMulti(optionName: string) {
        const option = {
            id: `value-${this.options.length}`,
            name: optionName,
        };

        this.optionsMulti.push(option);
        this.comboboxControlMulti.setValue([...(this.comboboxControlMulti.value || []), option]);
    }

    public displayFn(item: IExampleItem): string {
        return item?.name || "";
    }

    public convertToChip(value: IExampleItem) {
        return ({
            id: value.id,
            label: value.name,
        });
    }

    public isInErrorState() {
        return !!this.selectedItem;
    }

    public isDisabled(option: string) {
        return !!(parseInt(option.slice(-1) , 10) % 2);
    }

    public getOptions(amount: number, isDisabled?: boolean) {
        return Array.from({ length: amount }).map((_, i) =>
                    ({
                        id: `value-${i}`,
                        name: $localize `Item ${i}`,
                        disabled: isDisabled || i % 2 ? true : false,
                    }));
    }

    public showList(event: Event): void {
        event.stopPropagation();
        this.comboboxMultiDimensions.showDropdown();
        this.comboboxMultiDimensions.inputElement.nativeElement.focus();
    }

    public hideList(event: Event): void {
        event.stopPropagation();
        this.comboboxMultiDimensions.hideDropdown();
    }

    public toggleList(event: Event): void {
        event.stopPropagation();
        this.comboboxMultiDimensions.toggleDropdown();
        this.comboboxMultiDimensions.inputElement.nativeElement.focus();
    }

    ngOnInit() {
        this.fancyForm = this.formBuilder.group({
            combobox: this.formBuilder.control("", Validators.required),
        });

        this.comboboxControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => { this.selectedItem = value; });
        this.comboboxControlSingle.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => { this.selectedSingleItem = value; });
      }

    public open(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {size: "sm"});
    }

    public confirm(event: MouseEvent) {
        event?.stopPropagation();
        this.activeDialog = this.dialogService.confirm({
            message: "IS THIS SPARTA?",
            useOverlay: true,
        });
    }

    public openInOverlay(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {size: "lg", useOverlay: true});
    }

    public actionDone(): void {
        this.toastService.success({message: $localize `Action Done!`, title: $localize `Event`});
        this.activeDialog.close();
    }

    public actionCanceled(): void {
        this.toastService.info({message: $localize `Action Cancelled!`, title: $localize `Event`});
        this.activeDialog.close();
    }

    public onButtonClick(title: string) {
        title === "Action" ? this.actionDone() : this.actionCanceled();
        this.activeDialog.close();
    }
}
