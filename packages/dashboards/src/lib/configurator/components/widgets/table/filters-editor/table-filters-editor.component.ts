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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import get from "lodash/get";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    ITableWidgetColumnConfig,
    ITableWidgetConfig,
    ITableWidgetSorterConfig,
} from "../../../../../components/table-widget/types";
import { IHasChangeDetector, IHasForm } from "../../../../../types";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";

@Component({
    selector: "nui-table-filters-editor-component",
    templateUrl: "table-filters-editor.component.html",
    styleUrls: ["table-filters-editor.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class TableFiltersEditorComponent
    implements OnInit, OnChanges, OnDestroy, IHasForm, IHasChangeDetector
{
    static lateLoadKey = "TableFiltersEditorComponent";

    @Input() sorterConfiguration: ITableWidgetSorterConfig;
    @Input() columns: Array<ITableWidgetColumnConfig> = [];

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public selectedSortByValue: string;
    public selectedSortOrderValue: string;
    public sortableColumns: Array<ITableWidgetColumnConfig> = [];

    private onDestroy$ = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        public configuratorHeading: ConfiguratorHeadingService,
        public changeDetector: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            sorterConfiguration: this.formBuilder.group({
                sortBy: get(this.sorterConfiguration, "sortBy", ""),
                descendantSorting: get(
                    this.sorterConfiguration,
                    "descendantSorting",
                    false
                ),
            }),
        });

        this.form.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((val) => {
                this.setAccordionSubtitleValues(val);
            });
        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const sortByFormControl = this.form
            .get("sorterConfiguration")
            ?.get("sortBy");
        const descendantSortingFormControl = this.form
            .get("sorterConfiguration")
            ?.get("descendantSorting");

        if (changes.sorterConfiguration) {
            const sortedColumn = this.sortableColumns.find(
                (column) => column.id === this.sorterConfiguration?.sortBy
            );
            sortByFormControl?.setValue(sortedColumn?.id, { emitEvent: false });
            descendantSortingFormControl?.setValue(
                this.sorterConfiguration?.descendantSorting,
                { emitEvent: false }
            );
        }
        if (changes.columns) {
            this.sortableColumns = this.columns.filter(
                (column: ITableWidgetColumnConfig) =>
                    !!column.formatter && (column.sortable ?? true)
            );
            const sortedColumn = this.sortableColumns.find(
                (column) => column.id === this.sorterConfiguration?.sortBy
            );

            sortByFormControl?.setValue(sortedColumn?.id, { emitEvent: false });
            descendantSortingFormControl?.setValue(
                this.sorterConfiguration?.descendantSorting,
                { emitEvent: false }
            );

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
            const sortedColumn = this.columns?.find(
                (col) => col.id === val.sorterConfiguration.sortBy
            );
            if (!sortedColumn) {
                this.selectedSortByValue = $localize`No sorting`;
                this.selectedSortOrderValue = "";
                this.form
                    .get("sorterConfiguration")
                    ?.patchValue(
                        { sortBy: "", descendantSorting: "" },
                        { emitEvent: false }
                    );
                return;
            }
            const sortOrder = val.sorterConfiguration.descendantSorting
                ? $localize`Descending`
                : $localize`Ascending`;
            this.selectedSortByValue = sortedColumn.label;
            this.selectedSortOrderValue = ", " + sortOrder;

            this.changeDetector.detectChanges();
        }
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
