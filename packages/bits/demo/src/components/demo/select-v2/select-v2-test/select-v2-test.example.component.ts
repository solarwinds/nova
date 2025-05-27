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
import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    DialogService,
    ISelectGroup,
    NuiDialogRef,
    OVERLAY_WITH_POPUP_STYLES_CLASS,
    SelectV2Component,
} from "@nova-ui/bits";

interface IExampleItem {
    id: string;
    name?: string;
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
export class SelectV2TestExampleComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    public selectedItem: IExampleItem | null;
    public handleClicksOutside: boolean = false;
    public iconItems = [
        "status_warning",
        "status_up",
        "status_critical",
        "status_reserved",
        "status_unplugged",
        "status_unknown",
        "status_down",
        "status_missing",
        "status_sleep",
    ];
    // Datasources
    public items = Array.from({ length: 50 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public itemsDisplayValue: IExampleItem[] = Array.from({ length: 100 }).map(
        (_, i) => ({
            id: `value-${i}`,
            name: $localize`Item ${i}`,
            icon: "status_warning",
            disabled: !!(i % 2),
        })
    );
    public itemsWithIconsOnly: IExampleItem[] = this.iconItems.map(
        (icon, i) => ({
            id: `value-${i}`,
            icon: icon,
        })
    );
    public groupedItems: ISelectGroup[] = Array.from({ length: 10 }).map(
        (_, i) => ({
            header: $localize`Header line ${i + 1}`,
            items: Array.from({ length: 5 }).map((v, n) => ({
                id: `value-${i}`,
                name: $localize`Item ${n + 1}`,
            })),
        })
    );
    // Form
    public selectControl = new FormControl<IExampleItem | null>(null);
    public fancyForm;
    // Test
    public customStylesOverlayConfig: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS, "custom-select-styles"],
    };
    private destroy$ = new Subject<void>();
    private activeDialog: NuiDialogRef;
    @ViewChild("custom_control") private select: SelectV2Component;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        private formBuilder: FormBuilder
    ) {
        this.fancyForm = this.formBuilder.group({
            select: this.formBuilder.control("", Validators.required),
        });
    }

    // Dialog
    public open(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, { size: "sm" });
    }

    public isInErrorState(): boolean {
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

    public ngOnInit(): void {
        this.selectControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.selectedItem = value;
            });
    }

    public ngAfterViewInit(): void {
        this.select.clickOutsideDropdown.subscribe(() => {
            if (this.handleClicksOutside) {
                this.select.hideDropdown();
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
