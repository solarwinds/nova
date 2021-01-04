import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import get from "lodash/get";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ITableWidgetColumnConfig, ITableWidgetConfig, ITableWidgetSorterConfig } from "../../../../../components/table-widget/types";
import { IHasChangeDetector, IHasForm } from "../../../../../types";

@Component({
    selector: "nui-table-filters-editor-component",
    templateUrl: "table-filters-editor.component.html",
    styleUrls: ["table-filters-editor.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TableFiltersEditorComponent implements OnInit, OnChanges, OnDestroy, IHasForm, IHasChangeDetector {
    static lateLoadKey = "TableFiltersEditorComponent";

    @Input() sorterConfiguration: ITableWidgetSorterConfig;
    @Input() columns: Array<ITableWidgetColumnConfig> = [];

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public selectedSortByValue: string;
    public selectedSortOrderValue: string;
    public sortableColumns: Array<ITableWidgetColumnConfig> = [];

    private onDestroy$ = new Subject<void>();

    constructor(private formBuilder: FormBuilder,
                public changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            sorterConfiguration: this.formBuilder.group({
                sortBy: get(this.sorterConfiguration, "sortBy", ""),
                descendantSorting: get(this.sorterConfiguration, "descendantSorting", false),
            }),
        });

        this.form.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(val => {
                this.setAccordionSubtitleValues(val);
            });
        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const sortByFormControl = this.form.get("sorterConfiguration")?.get("sortBy");
        const descendantSortingFormControl = this.form.get("sorterConfiguration")?.get("descendantSorting");
        if (changes.sorterConfiguration) {
            const sortedColumn = this.sortableColumns.find(column => column.id === this.sorterConfiguration?.sortBy);
            sortByFormControl?.setValue(sortedColumn?.id, { emitEvent: false });
            descendantSortingFormControl?.setValue(this.sorterConfiguration?.descendantSorting, { emitEvent: false });
        }
        if (changes.columns) {
            this.sortableColumns = this.columns.filter((column: ITableWidgetColumnConfig) => !!column.formatter && (column.sortable ?? true));
            const sortedColumn = this.sortableColumns.find(column => column.id === this.sorterConfiguration?.sortBy);

            sortByFormControl?.setValue(sortedColumn?.id, { emitEvent: false });
            descendantSortingFormControl?.setValue(this.sorterConfiguration?.descendantSorting, { emitEvent: false });

            if (this.sortableColumns.length === 0) {
                sortByFormControl?.disable();
                descendantSortingFormControl?.disable();
            } else {
                sortByFormControl?.enable();
                descendantSortingFormControl?.enable();
            }
        }
        this.changeDetector.detectChanges();
    }

    private setAccordionSubtitleValues(val: ITableWidgetConfig) {
        if (val.sorterConfiguration) {
            const sortedColumn = this.columns?.find(col => col.id === val.sorterConfiguration.sortBy);
            if (!sortedColumn) {
                this.selectedSortByValue = $localize`No sorting`;
                this.selectedSortOrderValue = "";
                this.form.get("sorterConfiguration")?.patchValue({ sortBy: "", descendantSorting: "" }, { emitEvent: false });
                return;
            }
            const sortOrder = val.sorterConfiguration.descendantSorting ? $localize`Descending` : $localize`Ascending`;
            this.selectedSortByValue = sortedColumn.label;
            this.selectedSortOrderValue = ", " + sortOrder;

            this.changeDetector.detectChanges();
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
