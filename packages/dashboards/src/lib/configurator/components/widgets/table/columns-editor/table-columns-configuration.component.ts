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
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
} from "@angular/forms";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import values from "lodash/values";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

import {
    DialogService,
    EventBus,
    IDataField,
    IDataSource,
    IEvent,
    immutableSet,
    uuid,
} from "@nova-ui/bits";

import { IDataSourceOutput } from "../../../../../components/providers/types";
import { ITableWidgetColumnConfig } from "../../../../../components/table-widget/types";
import { IFormatterDefinition } from "../../../../../components/types";
import { IPizzagnaProperty } from "../../../../../pizzagna/functions/get-pizzagna-property-path";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import {
    ISetPropertyPayload,
    SET_PROPERTY_VALUE,
} from "../../../../../services/types";
import {
    IHasForm,
    IPizzagna,
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
    WellKnownDataSourceFeatures,
} from "../../../../../types";
import { DATA_SOURCE_CREATED, DATA_SOURCE_OUTPUT } from "../../../../types";

@Component({
    selector: "nui-table-columns-configuration",
    templateUrl: "./table-columns-configuration.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnsConfigurationComponent
    implements OnInit, IHasForm, OnChanges, OnDestroy
{
    static lateLoadKey = "TableColumnsConfigurationComponent";

    @Input() columns: ITableWidgetColumnConfig[] = [];
    @Input() formatters: Array<IFormatterDefinition> = [];
    @Input() componentId: string;
    @Input() dataFields: Array<IDataField> = [];
    @Input() nodes: string[];

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public emptyColumns$: Observable<boolean>;

    // the last selected data source will be stored here
    public dataSource: IDataSource;

    private onDestroy$: Subject<void> = new Subject<void>();

    // hackfix for NUI-5712
    // Depending on the timing of pizzagna changes, the incoming value for dataFields may be undefined.
    // This property ensures that we are only acting on valid values for the data fields.
    private lastValidDataFields: IDataField[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private changeDetector: ChangeDetectorRef,
        private dialogService: DialogService,
        private pizzagnaService: PizzagnaService,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>
    ) {
        this.eventBus.subscribeUntil(
            DATA_SOURCE_CREATED,
            this.onDestroy$,
            (event: IEvent<IDataSource>) => {
                if (!event.payload) {
                    return;
                }

                this.dataSource = event.payload;
            }
        );

        this.eventBus.subscribeUntil(
            DATA_SOURCE_OUTPUT,
            this.onDestroy$,
            (event: IEvent<any | IDataSourceOutput<any>>) => {
                // Because typing is lenient for the data source output, the event may or may not contain an IDataSourceOutput
                // with a result property; the payload may actually be the result itself, so both possibilities are accommodated.
                const { dataFields } = isUndefined(event.payload.result)
                    ? event.payload
                    : event.payload.result || {};

                if (dataFields) {
                    let formPizzagna: IPizzagna = this.pizzagnaService.pizzagna;
                    formPizzagna = immutableSet(
                        formPizzagna,
                        `${PizzagnaLayer.Data}.columns.properties.dataFields`,
                        dataFields
                    );

                    const columnsTemplate =
                        this.pizzagnaService.pizzagna[PizzagnaLayer.Structure]
                            .columns.properties?.template;
                    const presentationIndex = columnsTemplate.findIndex(
                        (val: { id: string }) => val.id === "presentation"
                    );
                    const presentationPizzagnaPath: string = `${PizzagnaLayer.Structure}.columns.properties.template[${presentationIndex}].properties.dataFields`;
                    formPizzagna = immutableSet(
                        formPizzagna,
                        presentationPizzagnaPath,
                        dataFields
                    );

                    const columns = get(
                        this.pizzagnaService.pizzagna,
                        `${PizzagnaLayer.Data}.columns.properties.columns`
                    ) as any;
                    const columnIds = columns.map(
                        (c: ITableWidgetColumnConfig) => c.id
                    );
                    formPizzagna = columnIds.reduce(
                        (res: IPizzagna, id: string) =>
                            immutableSet(
                                res,
                                `${PizzagnaLayer.Data}.${id}/presentation.properties.dataFields`,
                                dataFields
                            ),
                        formPizzagna
                    );

                    this.pizzagnaService.updatePizzagna(formPizzagna);

                    this.eventBus.getStream(SET_PROPERTY_VALUE).next({
                        payload: {
                            path: "",
                            value: formPizzagna,
                        } as ISetPropertyPayload,
                    });
                }
            }
        );
    }

    public ngOnInit() {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.dataFields && changes.dataFields.currentValue) {
            // hackfix for NUI-5712
            this.lastValidDataFields = changes.dataFields.currentValue;

            const disableColumnGeneration =
                this.dataSource?.features?.getFeatureConfig(
                    WellKnownDataSourceFeatures.DisableTableColumnGeneration
                )?.enabled;

            const columns = this.mergeColumns(
                changes.dataFields.currentValue,
                this.columns
            );
            if (columns?.length || disableColumnGeneration) {
                // if disableColumnGeneration is enabled and there are no columns to be kept,
                // we have to clear the form by updating the column input via the `onItemsChange` method
                this.onItemsChange(columns);
            } else {
                if (!disableColumnGeneration) {
                    this.resetColumns(false);
                }
            }
            // column components are not updated properly without this one
            setTimeout(() => this.changeDetector.markForCheck());
        }

        if (changes.columns) {
            const components = this.columns.map((c) => ({
                id: c.id,
                children: {
                    [`${c.id}/description`]: {
                        ...c,
                    },
                    [`${c.id}/presentation`]: {
                        ...c,
                    },
                },
            }));

            this.pizzagnaService.createComponentsFromTemplateWithProperties(
                "columns",
                components
            );

            // wait for column components to be created from template
            setTimeout(() => {
                // triggering the form update to update the preview - without this it was not updating the last added column as form field changes through
                // pizzagna don't generate valueChange events
                this.form
                    .get("columns")
                    ?.setValue([...this.form.get("columns")?.value]);
            });
        }
    }

    public onFormReady(form: AbstractControl) {
        this.form = this.formBuilder.group({
            columns: form as FormArray,
            // this form field serves as a source of truth for anybody interesting in reading/modifying the columns value
            // originally the values were mapped from the form directly to the preview without having a place where all the data would be consolidated
            // together in the form. Converters subscribe to this form field to listen for column changes. The value is transformed in this method down below.
            columnsOutput: {},
        });
        this.emptyColumns$ = this.form.valueChanges.pipe(
            map((result) => result.columns.length === 0)
        );
        this.formReady.emit(this.form);

        // we listen for changes of the `columns` and transform it into ITableWidgetColumnConfig[]
        this.form.get("columns")?.valueChanges.subscribe((value) => {
            const newColumns = value.map(
                (c: any /* form representing one column */) => {
                    let result: ITableWidgetColumnConfig = {
                        id: c.id,
                    } as any;
                    for (const key of Object.keys(c.properties)) {
                        result = {
                            ...result,
                            ...c.properties[
                                key
                            ] /* merge properties from each child form */,
                        };
                    }
                    result.sortable = this.lastValidDataFields?.find(
                        (df) =>
                            df.id ===
                            result.formatter?.properties?.dataFieldIds?.value
                    )?.sortable;
                    return result;
                }
            );

            this.form.get("columnsOutput")?.setValue(newColumns);
        });
    }

    public onItemsChange(columns: ITableWidgetColumnConfig[]) {
        const parentPath = "columns";
        const componentIds = columns.map((tile) => tile.id);
        this.pizzagnaService.createComponentsFromTemplate(
            parentPath,
            componentIds
        );

        const property: IPizzagnaProperty = {
            componentId: this.componentId,
            pizzagnaKey: PizzagnaLayer.Data,
            propertyPath: ["columns"],
        };
        this.pizzagnaService.setProperty(property, columns);
    }

    public addColumn() {
        // @ts-ignore: Types of property 'formatter' are incompatible.
        this.onItemsChange([
            ...this.columns,
            {
                id: uuid("column"),
                label: "",
                formatter: undefined,
            },
        ]);
    }

    public onResetColumns() {
        this.resetColumns(!!this.columns?.length);
    }

    public resetColumns(confirmation: boolean) {
        const reset = () => {
            const columns: ITableWidgetColumnConfig[] =
                this.lastValidDataFields.map((df) => ({
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

            this.onItemsChange(columns);
        };

        if (confirmation) {
            const dialog = this.dialogService.confirm({
                title: $localize`Are you sure?`,
                message: $localize`Resetting the columns will revert them to their default configurations. Do you wish to proceed?`,
                confirmText: $localize`Reset Columns`,
            });

            dialog.result.then(
                (result) => {
                    if (result) {
                        reset();
                    }
                },
                () => {
                    // this being here prevents a "unhandled rejection" console error from showing up
                }
            );
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
    private mergeColumns(
        currentDatafields: IDataField[],
        columns: ITableWidgetColumnConfig[]
    ): ITableWidgetColumnConfig[] {
        const currentDatafieldIds = currentDatafields.map(
            (datafield) => datafield.id
        );
        return columns.filter((column) => {
            if (!column.formatter?.properties?.dataFieldIds) {
                return false;
            }
            return values(column.formatter?.properties?.dataFieldIds).some(
                (datafield: string) => currentDatafieldIds.includes(datafield)
            );
        });
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
