// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { OverlayConfig } from "@angular/cdk/overlay";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable, of, Subject } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { delay, filter, takeUntil, tap } from "rxjs/operators";

import {
    ComboboxV2Component,
    DialogService,
    NuiDialogRef,
    OVERLAY_WITH_POPUP_STYLES_CLASS,
    ToastService,
} from "@nova-ui/bits";

interface IExampleItem {
    id: string;
    name: string;
    icon?: string;
    disabled?: boolean;
}

const defaultContainerHeight: number = 300;

@Component({
    selector: "nui-combobox-v2-test-example",
    templateUrl: "combobox-v2-test.example.component.html",
    styleUrls: ["combobox-v2-test.example.component.less"],
    host: { class: "combobox-container" },
})
export class ComboboxV2TestExampleComponent implements OnInit, AfterViewInit {
    public virtualItems = Array.from({ length: 100000 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public filteredItems: Observable<any[]> = of([...this.virtualItems]);
    public containerHeight: number = defaultContainerHeight;
    // Testing only
    public overlayConfig: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS, "combobox-v2-test-pane"],
    };
    // Data
    public options = Array.from({ length: 3 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public optionsMulti: IExampleItem[] = Array.from({ length: 3 }).map(
        (_, i) => ({
            id: `value-${i}`,
            name: $localize`Item ${i}`,
            disabled: i % 2 ? true : false,
        })
    );
    public optionsMultiDimensions = this.getOptions(50, false);
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public icons: any[] = ["check", "email", "execute"];
    public customizedItems: IExampleItem[] = Array.from({ length: 100 }).map(
        (_, i) => ({
            id: `value-${i}`,
            name: $localize`Item ${i}`,
            icon: this.getRandomIcon(),
        })
    );
    public selectedItem: IExampleItem | null;
    public selectedSingleItem: string | null;
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
    public comboboxControl = new FormControl<IExampleItem | null>(null);
    public comboboxControlSingle = new FormControl<string | null>(null);
    public comboboxControlMulti = new FormControl<
        { id: string; name: string }[] | null
    >(null);
    public fancyForm;
    public closePopoverSubject: Subject<void> = new Subject<void>();
    @ViewChild("comboboxSingle") public comboboxSingle: ComboboxV2Component;
    @ViewChild("comboboxMultiDimensions")
    public comboboxMultiDimensions: ComboboxV2Component;
    private activeDialog: NuiDialogRef;
    private destroy$: Subject<any> = new Subject<any>();
    private scrollOffset: number = 0;
    @ViewChild(CdkVirtualScrollViewport)
    private viewport: CdkVirtualScrollViewport;
    @ViewChild("virtual") private virtualCombobox: ComboboxV2Component;

    constructor(
        private formBuilder: FormBuilder,
        private dialogService: DialogService,
        private toastService: ToastService
    ) {
        this.fancyForm = this.formBuilder.group({
            combobox: this.formBuilder.control("", Validators.required),
        });
    }

    public closePopover(): void {
        this.closePopoverSubject.next();
    }

    public createOption(option: string): void {
        this.options.push(option);
        this.comboboxControlSingle.setValue(option);
    }

    public createOptionMulti(optionName: string): void {
        const option = {
            id: `value-${this.options.length}`,
            name: optionName,
        };

        this.optionsMulti.push(option);
        this.comboboxControlMulti.setValue([
            ...(this.comboboxControlMulti.value || []),
            option,
        ]);
    }

    public displayFn(item: IExampleItem): string {
        return item?.name || "";
    }

    public convertToChip(value: IExampleItem): {
        id: IExampleItem["id"];
        label: IExampleItem["name"];
    } {
        return {
            id: value.id,
            label: value.name,
        };
    }

    public isInErrorState(): boolean {
        return !!this.selectedItem;
    }

    public isDisabled(option: string): boolean {
        return !!(parseInt(option.slice(-1), 10) % 2);
    }

    public getOptions(
        amount: number,
        isDisabled?: boolean
    ): { id: string; name: string; disabled: boolean }[] {
        return Array.from({ length: amount }).map((_, i) => ({
            id: `value-${i}`,
            name: $localize`Item ${i}`,
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

    public ngOnInit(): void {
        this.comboboxControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.selectedItem = value;
            });
        this.comboboxControlSingle.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.selectedSingleItem = value;
            });
    }

    public ngAfterViewInit(): void {
        this.virtualCombobox.valueSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.scrollOffset = this.viewport.measureScrollOffset();
            });

        this.virtualCombobox.valueChanged
            .pipe(
                filter((v) => v !== undefined),
                // eslint-disable-next-line import/no-deprecated
                tap(
                    (v) =>
                        (this.filteredItems = of(this.filterItems(v as string)))
                ),
                delay(0),
                // eslint-disable-next-line import/no-deprecated
                tap(this.calculateContainerHeight),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public open(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, { size: "sm" });
    }

    public confirm(event: MouseEvent): void {
        event?.stopPropagation();
        this.activeDialog = this.dialogService.confirm({
            message: "IS THIS SPARTA?",
            useOverlay: true,
        });
    }

    public openInOverlay(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, {
            size: "lg",
            useOverlay: true,
        });
    }

    public actionDone(): void {
        this.toastService.success({
            message: $localize`Action Done!`,
            title: $localize`Event`,
        });
        this.activeDialog.close();
    }

    public actionCanceled(): void {
        this.toastService.info({
            message: $localize`Action Cancelled!`,
            title: $localize`Event`,
        });
        this.activeDialog.close();
    }

    public onButtonClick(title: string): void {
        title === "Action" ? this.actionDone() : this.actionCanceled();
        this.activeDialog.close();
    }

    private getRandomIcon() {
        return this.icons[Math.round(Math.random() * 2)];
    }

    private filterItems(value: string): string[] {
        if (!value) {
            return this.virtualItems;
        }
        const filterValue = value?.toLowerCase();

        return this.virtualItems.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    private calculateContainerHeight = (): void => {
        if (
            this.virtualCombobox.inputValue &&
            this.viewport.measureRenderedContentSize() < defaultContainerHeight
        ) {
            this.containerHeight = this.viewport.measureRenderedContentSize();
            return;
        }
        this.containerHeight = defaultContainerHeight;
    };
}
