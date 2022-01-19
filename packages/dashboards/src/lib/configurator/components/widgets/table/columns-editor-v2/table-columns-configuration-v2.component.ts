import { CdkDragDrop, CdkDragStart } from "@angular/cdk/drag-drop";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DialogService, EventBus, IDataField, IDataSource, IEvent, uuid } from "@nova-ui/bits";
import isUndefined from "lodash/isUndefined";
import values from "lodash/values";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IDataSourceError, IDataSourceOutput } from "../../../../../components/providers/types";
import { ITableWidgetColumnConfig } from "../../../../../components/table-widget/types";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { TableFormatterRegistryService } from "../../../../../services/table-formatter-registry.service";
import { IHasForm, PIZZAGNA_EVENT_BUS, WellKnownDataSourceFeatures } from "../../../../../types";
import { ConfiguratorDataSourceManagerService } from "../../../../services/configurator-data-source-manager.service";
import { DATA_SOURCE_CREATED, DATA_SOURCE_OUTPUT } from "../../../../types";

@Component({
    selector: "nui-table-columns-configuration",
    templateUrl: "./table-columns-configuration-v2.component.html",
    styleUrls: ["./table-columns-configuration-v2.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TableColumnsConfigurationV2Component implements OnInit, IHasForm, OnChanges, OnDestroy {
    static lateLoadKey = "TableColumnsConfigurationV2Component";

    @Input() columns: ITableWidgetColumnConfig[] = [];
    @Input() componentId: string;

    /**
     * @deprecated backward compatibility measure - deprecated in v11. Removal: NUI-5898
     *
     * This property is here because it was present in V1 component and was used to configure formatters
     */
    @Input() template: any;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public emptyColumns$: Observable<boolean>;
    // this can't be "dataFields" because that's an already used name for a property in pizzagna
    public dataSourceFields: Array<IDataField> = [];
    public draggedItemHeight: number;
    public isWidthMessageDisplayed = false;
    public dataSourceError: IDataSourceError | null;

    public get columnForms(): FormControl[] {
        return (this.form.controls["columns"] as FormArray).controls as FormControl[];
    }

    // the last selected data source will be stored here
    public dataSource: IDataSource;
    public columnLabel = $localize`Column`;

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(private formBuilder: FormBuilder,
                private changeDetector: ChangeDetectorRef,
                private dialogService: DialogService,
                private pizzagnaService: PizzagnaService,
                public dataSourceManager: ConfiguratorDataSourceManagerService,
                public tableFormatterRegistry: TableFormatterRegistryService,
                @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>) {
        this.form = this.formBuilder.group({
            columns: this.formBuilder.array([]),
        });

        this.form.controls["columns"].valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((columns: ITableWidgetColumnConfig[]) => {
                this.isWidthMessageDisplayed = this.getWidthMessageDisplayed(columns);
                this.changeDetector.markForCheck();
            });

        this.eventBus.subscribeUntil(DATA_SOURCE_CREATED, this.onDestroy$, (event: IEvent<IDataSource>) => {
            if (!event.payload) {
                return;
            }

            this.dataSource = event.payload;
            this.changeDetector.markForCheck();
        });

        this.eventBus.subscribeUntil(DATA_SOURCE_OUTPUT, this.onDestroy$, (event: IEvent<any | IDataSourceOutput<any>>) => {
            if (event.payload?.error) {
                return;
            }
            const { dataFields } = isUndefined(event.payload.result) ? event.payload : (event.payload.result || {});
            this.dataSourceFields = dataFields ?? [];
            const disableColumnGeneration = this.dataSource?.features?.getFeatureConfig(WellKnownDataSourceFeatures.DisableTableColumnGeneration)?.enabled;

            const columns = this.mergeColumns(this.dataSourceFields, this.getColumns());
            if (columns?.length || disableColumnGeneration) {
                // if disableColumnGeneration is enabled and there are no columns to be kept,
                // we have to clear the form by updating the column input via the `onItemsChange` method
                this.updateColumns(columns);
            } else {
                if (!disableColumnGeneration) {
                    this.resetColumns(false);
                }
            }
            this.changeDetector.markForCheck();
        });
        dataSourceManager.error$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((err: IDataSourceError | null) => {
                this.dataSourceError = err;
                this.changeDetector.markForCheck();
            });
    }

    public ngOnInit() {
        this.formReady.emit(this.form);

        if (this.template && !this.tableFormatterRegistry.getItems()?.length) {
            const formatters = this.template?.[1].properties?.formatters;
            this.tableFormatterRegistry.addItems(formatters);
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // columns from input property are set directly to the form
        if (changes.columns) {
            this.updateColumns(this.columns, false);
        }
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    public getColumns() {
        return this.form.controls["columns"].value;
    }

    public updateColumns(columns: ITableWidgetColumnConfig[], emitEvent: boolean = true) {
        const cols = this.form.controls["columns"] as FormArray;
        cols.controls = columns.map(c => {
            const fc = new FormControl(c);
            fc.setParent(cols);

            // Nova's markAsTouched function gets attached to formControl during init of TableColumnConfigurationComponent,
            // must be pass to newly created formControl here otherwise gets lost and column validation doesn't get triggered.
            const colControl = cols.controls.find(
                (cControl: AbstractControl) => cControl.value.id === c.id
            );
            if (colControl) {
                fc.markAsTouched = colControl.markAsTouched;
            }

            return fc;
        });
        cols.updateValueAndValidity({ emitEvent });

        this.changeDetector.markForCheck();
    }

    public trackBy(index: number, item: FormControl) {
        return item?.value?.id;
    }

    public addColumn() {
        (this.form.controls["columns"] as FormArray).push(new FormControl({
            id: uuid("column"),
            label: "",
            isActive: true,
            formatter: {},
        } as ITableWidgetColumnConfig));
    }

    public onResetColumns() {
        this.resetColumns(!!this.getColumns()?.length);
    }

    public resetColumns(confirmation: boolean) {
        const reset = () => {
            const columns: ITableWidgetColumnConfig[] = this.dataSourceFields?.map(df => ({
                id: uuid("column"),
                formatter: {
                    componentType: "RawFormatterComponent",
                    properties: {
                        dataFieldIds: {
                            value: df.id,
                        },
                    },
                },
                isActive: true,
                label: df.label,
                width: undefined,
                sortable: df.sortable,
            }));

            this.updateColumns(columns);
        };

        if (confirmation) {
            const dialog = this.dialogService.confirm({
                title: $localize`Are you sure?`,
                message: $localize`Resetting the columns will revert them to their default configurations. Do you wish to proceed?`,
                confirmText: $localize`Reset Columns`,
            });

            dialog.result
                .then((result) => {
                    if (result) {
                        reset();
                    }
                }, () => {
                    // this being here prevents a "unhandled rejection" console error from showing up
                });
        } else {
            reset();
        }
    }

    /**
     * Merges current column definitions with new incoming data fields
     *
     * @param currentDatafields
     * @param columns
     */
    private mergeColumns(currentDatafields: IDataField[], columns: ITableWidgetColumnConfig[]): ITableWidgetColumnConfig[] {
        const currentDatafieldIds = currentDatafields.map(datafield => datafield.id);
        return columns.filter(column => {
            if (!column.formatter?.properties?.dataFieldIds) {
                return false;
            }
            return values(column.formatter?.properties?.dataFieldIds).some((datafield: string) => currentDatafieldIds.includes(datafield));
        });
    }

    /**
     * This method calculates whether the width message should be displayed
     *
     * @param columns
     * @private
     */
    private getWidthMessageDisplayed(columns: ITableWidgetColumnConfig[]) {
        let count = 0;
        for (const c of columns) {
            if (typeof c.width !== "number") {
                count++;
            }
            if (count > 1) {
                return false;
            }
        }
        return true;
    }

    // ------------------------------------------------- items dynamic stuff ------------------------------------------------

    public moveItem(index: number, toIndex: number) {
        const columns = (this.form.controls["columns"] as FormArray);

        const column = columns.at(index);
        columns.removeAt(index);
        columns.insert(toIndex, column);

        this.changeDetector.detectChanges();
    }

    public removeItem(index: number): void {
        const columns = (this.form.controls["columns"] as FormArray);
        columns.removeAt(index);

        this.changeDetector.detectChanges();
    }

    public drop(event: CdkDragDrop<string[]>) {
        this.moveItem(event.previousIndex, event.currentIndex);
    }

    public cdkDragStarted(event: CdkDragStart): void {
        this.draggedItemHeight = event.source.element.nativeElement.offsetHeight;
    }

}
