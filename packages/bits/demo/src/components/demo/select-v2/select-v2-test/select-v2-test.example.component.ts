import { OverlayConfig } from "@angular/cdk/overlay";
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DialogService, ISelectGroup, NuiDialogRef, OVERLAY_WITH_POPUP_STYLES_CLASS, SelectV2Component } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

interface IExampleItem {
    id: string;
    name: string;
    icon?: string;
    disabled?: boolean;
}

@Component({
    selector: "nui-select-v2-test-example",
    templateUrl: "./select-v2-test.example.component.html",
    styleUrls: ["./select-v2-test.example.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: { class: "select-container" },
})
export class SelectV2TestExampleComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(@Inject(DialogService) private dialogService: DialogService,
                                       private formBuilder: FormBuilder) {}
    public selectedItem: IExampleItem;
    public handleClicksOutside: boolean = false;

    // Datasources
    public items = Array.from({ length : 50 }).map((_, i) => $localize `Item ${i}`);
    public itemsDisplayValue: IExampleItem[] = Array.from({ length: 100 }).map((_, i) =>
            ({
                id: `value-${i}`,
                name: $localize `Item ${i}`,
                icon: "check",
                disabled: !!(i % 2),
            }));

    public groupedItems: ISelectGroup[] = Array.from({ length: 10 }).map((_, i) => ({
                header: $localize `Header line ${i + 1}`,
                items: Array.from({ length: 5 }).map((v, n) => ({
                    id: `value-${i}`,
                    name: $localize `Item ${n + 1}`,
                })),
    }));

    // Form
    public selectControl = new FormControl();
    public fancyForm: FormGroup;


    // Test
    public customStylesOverlayConfig: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS, "custom-select-styles"],
    };

    private destroy$: Subject<any> = new Subject<any>();
    private activeDialog: NuiDialogRef;

    @ViewChild("custom_control") private select: SelectV2Component;

    // Dialog
    public open(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {size: "sm"});
    }

    public isInErrorState() {
        return !this.selectedItem;
    }

    public showList(event: Event): void {
        event.stopPropagation();
        this.select.showDropdown();
        this.select.inputElement.nativeElement.focus();
    }

    public hideList(event: Event): void {
        event.stopPropagation();
        this.select.hideDropdown();
    }

    public toggleList(event: Event): void {
        event.stopPropagation();
        this.select.toggleDropdown();
        this.select.inputElement.nativeElement.focus();
    }

    ngOnInit(): void {
        this.fancyForm = this.formBuilder.group({
            select: this.formBuilder.control("", Validators.required),
        });

        this.selectControl.valueChanges
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(value => {
                this.selectedItem = value;
            });
    }

    ngAfterViewInit() {
        this.select.clickOutsideDropdown.subscribe(() => {
            if (this.handleClicksOutside) { this.select.hideDropdown(); }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
