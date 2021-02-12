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
} from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DialogService, EventBus, IDataSource, IEvent, uuid } from "@nova-ui/bits";
import isUndefined from "lodash/isUndefined";
import values from "lodash/values";
import { Observable, Subject } from "rxjs";

import { IDataSourceOutput } from "../../../../../components/providers/types";
import { IDataField, ITableWidgetColumnConfig } from "../../../../../components/table-widget/types";
import { IFormatterDefinition } from "../../../../../components/types";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { IHasForm, PIZZAGNA_EVENT_BUS, WellKnownDataSourceFeatures } from "../../../../../types";
import { DATA_SOURCE_CREATED, DATA_SOURCE_OUTPUT } from "../../../../types";

@Component({
    selector: "nui-table-columns-configuration",
    templateUrl: "./table-columns-configuration-v2.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnsConfigurationComponentV2 implements OnInit, IHasForm, OnChanges, OnDestroy {
    static lateLoadKey = "TableColumnsConfigurationComponentV2";

    @Input() columns: ITableWidgetColumnConfig[] = [];
    // @Input() formatters: Array<IFormatterDefinition> = [];
    @Input() componentId: string;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public emptyColumns$: Observable<boolean>;
    public dataSourceFields: Array<IDataField> = [];

    public get columnForms(): FormControl[] {
        return (this.form.controls["columns"] as FormArray).controls as FormControl[];
    }

    // the last selected data source will be stored here
    public dataSource: IDataSource;

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(private formBuilder: FormBuilder,
                private changeDetector: ChangeDetectorRef,
                private dialogService: DialogService,
                private pizzagnaService: PizzagnaService,
                @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>) {
        this.form = this.formBuilder.group({
            columns: this.formBuilder.array([]),
        });

        this.eventBus.subscribeUntil(DATA_SOURCE_CREATED, this.onDestroy$, (event: IEvent<IDataSource>) => {
            if (!event.payload) {
                return;
            }

            this.dataSource = event.payload;
        });

        this.eventBus.subscribeUntil(DATA_SOURCE_OUTPUT, this.onDestroy$, (event: IEvent<any | IDataSourceOutput<any>>) => {
            const { dataFields } = isUndefined(event.payload.result) ? event.payload : (event.payload.result || {});

            this.dataSourceFields = dataFields;

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

            // column components are not updated properly without this one
            // setTimeout(() => this.changeDetector.markForCheck());
        });
    }

    public ngOnInit() {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // columns from input property are set directly to the form
        if (changes.columns) {
            this.updateColumns(this.columns, false);
        }
    }

    public getColumns() {
        return this.form.controls["columns"].value;
    }

    public updateColumns(columns: ITableWidgetColumnConfig[], emitEvent: boolean = true) {
        const arr = this.form.controls["columns"] as FormArray;
        arr.controls = columns.map(c => new FormControl(c));
        arr.updateValueAndValidity({ emitEvent });

        this.changeDetector.markForCheck();
    }

    public trackBy(index: number, item: ITableWidgetColumnConfig) {
        return item.id;
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
            const columns: ITableWidgetColumnConfig[] = this.dataSourceFields.map(df => ({
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

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
