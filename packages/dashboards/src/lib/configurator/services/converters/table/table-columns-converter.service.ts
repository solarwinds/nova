import { AfterViewInit, Inject } from "@angular/core";
import { AbstractControl, FormArray, FormGroup, Validators } from "@angular/forms";
import { EventBus, IEvent, immutableSet } from "@solarwinds/nova-bits";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import isUndefined from "lodash/isUndefined";
import { distinctUntilChanged, distinctUntilKeyChanged, filter, map, pluck, startWith, takeUntil, tap } from "rxjs/operators";

import { IDataSourceOutput } from "../../../../components/providers/types";
import { ITableWidgetColumnConfig } from "../../../../components/table-widget/types";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { IComponentConfiguration, IPizzagna, PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../../../types";
import { IItemConfiguration } from "../../../components/types";
import { DATA_SOURCE_OUTPUT } from "../../../types";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

export class TableColumnsConverterService extends BaseConverter implements AfterViewInit {
    private presentationKey = "presentation";

    private shouldReadForm = false;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                previewService: PreviewService,
                pizzagnaService: PizzagnaService) {
        super(eventBus, previewService, pizzagnaService);

        this.eventBus.subscribeUntil(DATA_SOURCE_OUTPUT, this.destroy$, (event: IEvent<any | IDataSourceOutput<any>>) => {

            // Because typing is lenient for the data source output, the event may or may not contain an IDataSourceOutput
            // with a result property; the payload may actually be the result itself, so both possibilities are accommodated.
            const { dataFields } = isUndefined(event.payload.result) ? event.payload : (event.payload.result || {});

            if (dataFields) {
                let formPizzagna: IPizzagna = this.pizzagnaService.pizzagna;
                formPizzagna = immutableSet(formPizzagna, `${PizzagnaLayer.Data}.columns.properties.dataFields`, dataFields);

                const columnsTemplate = this.pizzagnaService.pizzagna[PizzagnaLayer.Structure].columns.properties?.template;
                const presentationIndex = columnsTemplate.findIndex((val: { id: string; }) => val.id === this.presentationKey);
                const presentationPizzagnaPath: string = `${PizzagnaLayer.Structure}.columns.properties.template[${presentationIndex}].properties.dataFields`;
                formPizzagna = immutableSet(formPizzagna, presentationPizzagnaPath, dataFields);

                const columns = get(this.pizzagnaService.pizzagna, `${PizzagnaLayer.Data}.columns.properties.columns`) as any;
                const columnIds = columns.map((c: ITableWidgetColumnConfig) => c.id);
                formPizzagna = columnIds.reduce((res: IPizzagna, id: string) => immutableSet(
                    res,
                    `${PizzagnaLayer.Data}.${id}/${this.presentationKey}.properties.dataFields`,
                    dataFields
                ), formPizzagna);

                this.updateFormPizzagna(formPizzagna);
            }
        });
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }

    public buildForm(): void {
        const table = this.getPreview()?.table;
        const dataFields = table?.properties?.dataFields;

        const columnIds = table?.properties?.configuration?.columns?.map((column: ITableWidgetColumnConfig) => column.id);
        if (columnIds) {
            this.pizzagnaService.createComponentsFromTemplate("columns", columnIds);
        }
        let formPizzagna = this.pizzagnaService.pizzagna;

        formPizzagna = immutableSet(formPizzagna, `${PizzagnaLayer.Data}.columns.properties.columns`, table?.properties?.configuration?.columns ?? []);
        formPizzagna = immutableSet(formPizzagna, `${PizzagnaLayer.Data}.columns.properties.dataFields`, dataFields);

        this.updateFormPizzagna(formPizzagna);

        setTimeout(() => this.shouldReadForm = true);
        setTimeout(() => this.subscribeToColumnsValueChange());
    }

    public toPreview(form: FormGroup): void {
        form.get("columns")?.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(isEqual)
            )
            .subscribe((columns: ITableWidgetColumnConfig[]) => {
                if (!this.shouldReadForm) {
                    return;
                }

                const columnsPath = "table.properties.configuration.columns";
                const preview = this.getPreview();
                const previewColumns = get(preview, columnsPath, []) as Partial<IComponentConfiguration>[];

                // it's responsible for items order
                const updatedColumns = columns.map((formColumn: ITableWidgetColumnConfig) =>
                    ({
                        ...previewColumns.find(prevewColumn => prevewColumn.id === formColumn.id),
                        id: formColumn.id,
                    }));

                // need to wait till forms are initialized in case of creating new column
                setTimeout(() => this.updatePreview(immutableSet(preview, columnsPath, updatedColumns)));
            });
    }

    private subscribeToColumnsValueChange() {
        this.component.form.get("columns").valueChanges
            .pipe(
                tap(() => this.updateFilterProperties()),
                // trigger subscription after tableColumnsFormArray is filled with values
                startWith(this.component.form.get("columns").value),
                filter((columns: IItemConfiguration[]) => columns.length > 0),
                tap(() => this.handleWidthValidation()),
                map((columns: IItemConfiguration[]) => this.filterColumnsWithoutSpecifiedWidth(columns)),
                map((activeColumnsWithoutWidth: IItemConfiguration[]) => this.handleColumnsWithoutSpecifiedWidth(activeColumnsWithoutWidth)),
                distinctUntilKeyChanged("id"),
                pluck("id"),
                takeUntil(this.destroy$)
            )
            .subscribe((columnId: string) => this.setWidthMessages(columnId));
    }

    private updateFilterProperties() {
        // using a timeout to let change detection finish before reading values from the preview
        setTimeout(() => {
            const formPizzagna = this.pizzagnaService.pizzagna;
            const table = this.getPreview()?.table;
            const tableColumns = table?.properties?.configuration?.columns;
            const formPizzagnaColumns = formPizzagna?.data?.columns?.properties?.columns;

            // A column may have been removed. If that's the case, we need to use formPizzagnaColumns
            // as the table column array hasn't been updated at this point.
            const columnsToUse = formPizzagnaColumns.length < tableColumns.length ? formPizzagnaColumns : tableColumns;
            this.pizzagnaService.setProperty(`${PizzagnaLayer.Data}.filters.properties.columns`, columnsToUse);
            // Force a change detection cycle on the nodes of the presentation section
            this.pizzagnaService.setProperty(`${PizzagnaLayer.Structure}.presentation.properties.nodes`,
                [...formPizzagna?.structure?.presentation?.properties?.nodes]);
        });
    }

    /**
     * Filters columns which are active (visible) and don't have specified width
     * @param columns
     */
    private filterColumnsWithoutSpecifiedWidth(columns: IItemConfiguration[]) {
        return columns.filter(column => get(column, `properties[${column.id}/description].isActive`))
            .filter(column => !get(column, `properties[${column.id}/description].width`));
    }

    /**
     * Receives columns which are active and don't have specified width and returns:
     * - if all columns have specified width, reset width of the last column and return its id
     * - if there are only one column, set this columns id as last without specified width
     * - if there are more than one column that don't have specified width, do nothing
     * @param activeColumnsWithoutWidth
     */
    private handleColumnsWithoutSpecifiedWidth(activeColumnsWithoutWidth: Array<IItemConfiguration>) {
        switch (activeColumnsWithoutWidth.length) {
            // if all columns have specified width, reset last columns value so that other columns can resize
            case 0:
                const activeColumns = (this.component.form.get("columns") as FormArray).controls.filter(control =>
                    get(control, `value.properties[${control.value.id}/description].isActive`));
                if (isEmpty(activeColumns)) {
                    return {
                        id: undefined,
                        label: undefined,
                    };
                }
                const lastActiveColumn = activeColumns[activeColumns.length - 1];
                console.warn(`Cannot set width for all columns. Resetting "${lastActiveColumn.value.label}" width.`);
                lastActiveColumn.patchValue({ width: null }, { emitEvent: false });
                return lastActiveColumn.value;
            case 1:
                return activeColumnsWithoutWidth[0];
            default:
                return {
                    id: undefined,
                    label: undefined,
                };
        }
    }

    private handleWidthValidation() {
        (this.component.form.get("columns") as FormArray).controls.forEach((formGroup: AbstractControl) => {
            const descriptionFormPath = `properties.${formGroup.value.id}/description`;
            const descriptionForm = formGroup.get(descriptionFormPath);

            if (!descriptionForm) {
                return;
            }
            const isActive = descriptionForm.get("isActive")?.value;
            const widthFormField = descriptionForm.get("width");
            if (isActive) {
                widthFormField?.setValidators([Validators.min(62)]);
                widthFormField?.markAllAsTouched();
                widthFormField?.updateValueAndValidity({ emitEvent: false });
            } else {
                widthFormField?.clearValidators();
                widthFormField?.updateValueAndValidity({ emitEvent: false });
            }
        });
    }

    private setWidthMessages(columnId: string) {
        if (!this.pizzagnaService.pizzagna) {
            return;
        }

        const widthMessageInput = "isWidthMessageDisplayed";
        const { pizzagna } = this.pizzagnaService;
        const columns = pizzagna.data.columns.properties?.columns;
        columns.forEach((col: ITableWidgetColumnConfig) => this.pizzagnaService.setProperty(`${PizzagnaLayer.Data}.${col.id}/description.properties.${widthMessageInput}`, false));

        if (!columnId) {
            return;
        }
        this.pizzagnaService.setProperty(`${PizzagnaLayer.Data}.${columnId}/description.properties.${widthMessageInput}`, true);
    }
}
