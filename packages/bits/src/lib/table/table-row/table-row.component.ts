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

import {
    CdkFooterRow,
    CdkFooterRowDef,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef,
} from "@angular/cdk/table";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    IterableDiffers,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import _includes from "lodash/includes";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DEFAULT_INTERACTIVE_ELEMENTS } from "../../../constants/interaction.constants";
import { ISelectorState } from "../../../services/public-api";
import { CheckboxStatus, SelectionType } from "../../selector/public-api";
import { TableStateHandlerService } from "../table-state-handler.service";
import { ClickableRowOptions, RowHeightOptions } from "../types";

/* eslint-disable */

/**
 * @ignore
 */

@Directive({
    selector: "[nuiHeaderRowDef]",
    providers: [
        { provide: CdkHeaderRowDef, useExisting: TableHeaderRowDefDirective },
    ],
    host: { role: "row" },
})
export class TableHeaderRowDefDirective
    extends CdkHeaderRowDef
    implements OnInit, OnDestroy, OnChanges
{
    @Input() set nuiHeaderRowDef(value: any) {
        this.columns = value ?? [];
    }

    @Input() set nuiHeaderRowDefSticky(value: boolean) {
        this.sticky = value;
    }

    public tableColumnsSubscription: Subscription;

    constructor(
        template: TemplateRef<any>,
        _differs: IterableDiffers,
        private tableStateHandlerService: TableStateHandlerService
    ) {
        super(template, _differs);
    }

    public ngOnInit(): void {
        this.tableStateHandlerService.tableColumns = Array.from(this.columns);

        if (this.tableStateHandlerService.reorderable) {
            // reordering columns when drop is fired on column
            this.tableColumnsSubscription =
                this.tableStateHandlerService.columnsState.subscribe(
                    (tableColumns: string[]) => {
                        this.columns = tableColumns;
                    }
                );
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (changes.nuiHeaderRowDef) {
            this.tableStateHandlerService.tableColumns =
                changes.nuiHeaderRowDef.currentValue;
        }
    }

    public ngOnDestroy(): void {
        if (this.tableColumnsSubscription) {
            this.tableColumnsSubscription.unsubscribe();
        }
    }
}

/**
 * @ignore
 */

@Directive({
    selector: "[nuiRowDef]",
    providers: [{ provide: CdkRowDef, useExisting: TableRowDefDirective }],
})
export class TableRowDefDirective<T>
    extends CdkRowDef<T>
    implements OnInit, OnDestroy
{
    @Input() set nuiRowDefColumns(value: any) {
        this.columns = value ?? [];
    }

    @Input() set nuiRowDefWhen(value: (index: number, rowData: T) => boolean) {
        this.when = value;
    }

    public tableColumnsSubscription: Subscription;

    constructor(
        template: TemplateRef<any>,
        _differs: IterableDiffers,
        private tableStateHandlerService: TableStateHandlerService
    ) {
        super(template, _differs);
    }

    public ngOnInit(): void {
        this.tableStateHandlerService.tableColumns = Array.from(this.columns);

        if (this.tableStateHandlerService.reorderable) {
            // reordering columns when drop is fired on column
            this.tableColumnsSubscription =
                this.tableStateHandlerService.columnsState.subscribe(
                    (tableColumns: string[]) => {
                        this.columns = tableColumns;
                    }
                );
        }
    }

    public ngOnDestroy(): void {
        if (this.tableColumnsSubscription) {
            this.tableColumnsSubscription.unsubscribe();
        }
    }
}

/**
 * @ignore
 */

@Directive({
    selector: "[nuiFooterRowDef]",
    providers: [
        { provide: CdkFooterRowDef, useExisting: TableFooterRowDefDirective },
    ],
})
export class TableFooterRowDefDirective
    extends CdkFooterRowDef
    implements OnInit, OnDestroy
{
    @Input() set nuiFooterRowDef(value: any) {
        this.columns = value ?? [];
    }

    @Input() set nuiFooterRowDefSticky(value: boolean) {
        this.sticky = value;
    }

    public tableColumnsSubscription: Subscription;

    constructor(
        template: TemplateRef<any>,
        _differs: IterableDiffers,
        private tableStateHandlerService: TableStateHandlerService
    ) {
        super(template, _differs);
    }

    public ngOnInit(): void {
        this.tableStateHandlerService.tableColumns = Array.from(this.columns);

        if (this.tableStateHandlerService.reorderable) {
            // reordering columns when drop is fired on column
            this.tableColumnsSubscription =
                this.tableStateHandlerService.columnsState.subscribe(
                    (tableColumns: string[]) => {
                        this.columns = tableColumns;
                    }
                );
        }
    }

    public ngOnDestroy(): void {
        if (this.tableColumnsSubscription) {
            this.tableColumnsSubscription.unsubscribe();
        }
    }
}

/**
 * @ignore
 */

@Component({
    template: ` <th
            *ngIf="selectable"
            nuiClickInterceptor
            class="nui-table__table-header-cell nui-table__table-header-cell--selectable"
            [ngClass]="{ 'no-options': !hasOptions }"
        >
            <nui-selector
                class="nui-table__table-header-cell__selector"
                [ngClass]="{ 'no-options': !hasOptions }"
                [appendToBody]="true"
                (selectionChange)="onSelectorChange($event)"
                [checkboxStatus]="selectorState.checkboxStatus"
                [items]="selectorState.selectorItems"
            >
            </nui-selector>
        </th>
        <ng-container cdkCellOutlet></ng-container>`,
    host: {
        role: "row",
        class: "nui-table__table-header-row",
    },
    selector: "nui-header-row, tr[nui-header-row]",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: "nuiHeaderRow",
    providers: [
        { provide: CdkHeaderRow, useExisting: TableHeaderRowComponent },
    ],
})
export class TableHeaderRowComponent
    extends CdkHeaderRow
    implements OnInit, OnDestroy, AfterViewInit
{
    @Input() density: RowHeightOptions = "default";

    public selectorState: ISelectorState = {
        checkboxStatus: CheckboxStatus.Unchecked,
        selectorItems: [],
    };

    public selectable;
    public selectionChangeSubscription: Subscription;
    public dataSourceChangeSubscription: Subscription;

    @HostBinding("class.nui-table__table-header-row_height_default")
    get isDensityDefault() {
        return this.density.toLowerCase() === "default";
    }

    @HostBinding("class.nui-table__table-header-row_height_compact")
    get isDensityCompact() {
        return this.density.toLowerCase() === "compact";
    }

    @HostBinding("class.nui-table__table-header-row_height_tiny")
    get isDensityTiny() {
        return this.density.toLowerCase() === "tiny";
    }

    public get hasOptions(): boolean {
        return this.selectorState.selectorItems.length > 0;
    }

    private onDestroy$ = new Subject<void>();

    constructor(
        private tableStateHandlerService: TableStateHandlerService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        super();
        this.selectable = this.tableStateHandlerService.selectable;
    }

    public ngOnInit(): void {
        if (this.tableStateHandlerService.selectable) {
            this.selectorState =
                this.tableStateHandlerService.getSelectorState();
            this.updateSelectorState();
        }

        // if dataSource changes we need to update selector state
        this.dataSourceChangeSubscription =
            this.tableStateHandlerService.dataSourceChanged
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(() => {
                    this.updateSelectorState();
                });

        // when single row is selected we need to update selector state
        // we also need to detect changes for selector state
        this.selectionChangeSubscription =
            this.tableStateHandlerService.selectionChanged
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(() => {
                    this.updateSelectorState();
                });

        this.tableStateHandlerService.selectableChanged
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((selectable: boolean) => {
                this.selectable = selectable;
                this.changeDetectorRef.markForCheck();
            });
    }

    public ngAfterViewInit(): void {
        if (this.tableStateHandlerService.selectable) {
            this.tableStateHandlerService.applyStickyStyles();
        }
    }

    public onSelectorChange(selectorValue: SelectionType): void {
        this.tableStateHandlerService.selection =
            this.tableStateHandlerService.applySelector(selectorValue);
        this.updateSelectorState();
        this.tableStateHandlerService.selectionChanged.next(
            this.tableStateHandlerService.selection
        );
    }

    public updateSelectorState(): void {
        this.selectorState = this.tableStateHandlerService.getSelectorState();
        this.changeDetectorRef.detectChanges();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}

/**
 * @ignore
 */

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
    selector: "nui-row, tr[nui-row]",
    template: ` <td
            *ngIf="selectable"
            class="nui-table__table-cell nui-table__table-cell--selectable"
        >
            <nui-checkbox
                class="nui-table__table-cell__checkbox d-inline-block"
                [checked]="isRowSelected()"
                (valueChange)="checkboxClicked()"
                (click)="stopPropagation($event)"
                #rowSelectionCheckbox
            >
            </nui-checkbox>
        </td>
        <ng-container cdkCellOutlet></ng-container>`,
    host: {
        role: "row",
        class: "nui-table__table-row",
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: "nuiRow",
    providers: [{ provide: CdkRow, useExisting: TableRowComponent }],
})
export class TableRowComponent extends CdkRow implements OnInit, OnDestroy {
    @Input() density: RowHeightOptions = "default";
    @Input() rowObject: Object;
    @Input()
    @HostBinding("class.nui-table__table-row--clickable")
    clickableRow = false;
    @Input() clickableRowConfig: ClickableRowOptions = {
        clickableSelectors: ["nui-row", "tr[nui-row]"],
        ignoredSelectors: DEFAULT_INTERACTIVE_ELEMENTS,
    };
    public selectable;
    public selectionChangeSubscription: Subscription;

    @HostBinding("class.nui-table__table-row--selected")
    get isSelected() {
        return this.isRowSelected();
    }

    @HostBinding("class.nui-table__table-row_height_default")
    get isDensityDefault() {
        return this.density.toLowerCase() === "default";
    }

    @HostBinding("class.nui-table__table-row_height_compact")
    get isDensityCompact() {
        return this.density.toLowerCase() === "compact";
    }

    @HostBinding("class.nui-table__table-row_height_tiny")
    get isDensityTiny() {
        return this.density.toLowerCase() === "tiny";
    }

    @ViewChild("rowSelectionCheckbox", { read: ElementRef, static: false })
    private rowSelectionCheckbox: ElementRef;

    private onDestroy$ = new Subject<void>();

    constructor(
        private elementRef: ElementRef,
        private tableStateHandlerService: TableStateHandlerService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        super();
        this.selectable = this.tableStateHandlerService.selectable;
    }

    public ngOnInit(): void {
        const rowHeightClass = `nui-table__table-row_height_${this.density.toLowerCase()}`;
        this.elementRef.nativeElement.classList.add(rowHeightClass);

        // when selection changes we need to detect changes to check check-boxes
        this.selectionChangeSubscription =
            this.tableStateHandlerService.selectionChanged
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(() => {
                    this.changeDetectorRef.detectChanges();
                });

        this.tableStateHandlerService.selectableChanged
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((selectable: boolean) => {
                this.selectable = selectable;
                this.changeDetectorRef.markForCheck();
            });
    }

    @HostListener("click", ["$event.target"])
    public rowClickHandler(target: HTMLElement): void {
        if (
            !this.tableStateHandlerService.selectable ||
            !this.clickableRow ||
            !this.clickableRowConfig.clickableSelectors.length
        ) {
            return;
        }
        const closestTableRow = target.closest(
            this.clickableRowConfig.clickableSelectors.join(",")
        );
        if (!closestTableRow) {
            return;
        }
        if (
            this.clickableRowConfig.ignoredSelectors.length &&
            target.closest(this.clickableRowConfig.ignoredSelectors.join(","))
        ) {
            return;
        }
        const rowSelectCheckbox = closestTableRow.querySelector("nui-checkbox");
        if (rowSelectCheckbox === this.rowSelectionCheckbox.nativeElement) {
            this.checkboxClicked();
        }
    }

    public checkboxClicked(): void {
        this.tableStateHandlerService.handleRowCheckbox(this.rowObject);
    }

    /**
     * We need to stop propagation of the checkbox click to prevent the row click handler from invoking the checkbox toggle functionality again
     */
    public stopPropagation(event: Event): void {
        event.stopPropagation();
    }

    public isRowSelected(): boolean {
        const rowObjectTrackBy = this.tableStateHandlerService.trackBy(
            0,
            this.rowObject
        );

        const includedRows = this.tableStateHandlerService.selection.include;
        const excludedRows = this.tableStateHandlerService.selection.exclude;
        if (this.tableStateHandlerService.selection.isAllPages) {
            // case when we unselect one page by checkbox
            if (this.tableStateHandlerService.selection.exclude.length > 0) {
                return !_includes(excludedRows, rowObjectTrackBy);
            }
            return true;
        }
        return includedRows.length > 0
            ? _includes(includedRows, rowObjectTrackBy)
            : false;
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}

/**
 * @ignore
 */
@Component({
    selector: "nui-footer-row, tr[nui-footer-row]",
    template: "<ng-container cdkCellOutlet></ng-container>",
    host: {
        class: "nui-footer-row",
        role: "row",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    exportAs: "nuiFooterRow",
    providers: [
        { provide: CdkFooterRow, useExisting: TableFooterRowComponent },
    ],
})
export class TableFooterRowComponent extends CdkFooterRow {}
