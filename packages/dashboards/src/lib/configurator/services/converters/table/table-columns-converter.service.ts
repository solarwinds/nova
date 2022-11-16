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

import { AfterViewInit, Inject, Injectable } from "@angular/core";
import {
    AbstractControl,
    FormArray,
    FormGroup,
    Validators,
} from "@angular/forms";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import {
    distinctUntilChanged,
    distinctUntilKeyChanged,
    filter,
    map,
    pluck,
    // eslint-disable-next-line import/no-deprecated
    startWith,
    takeUntil,
    tap,
} from "rxjs/operators";

import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";

import { ITableWidgetColumnConfig } from "../../../../components/table-widget/types";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../../types";
import { IItemConfiguration } from "../../../components/types";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

@Injectable()
export class TableColumnsConverterService
    extends BaseConverter
    implements AfterViewInit
{
    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        previewService: PreviewService,
        pizzagnaService: PizzagnaService
    ) {
        super(eventBus, previewService, pizzagnaService);
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }

    public buildForm(): void {
        const table = this.getPreview()?.table;
        const dataFields = table?.properties?.dataFields;
        const columns = table?.properties?.configuration?.columns;

        let formPizzagna = this.pizzagnaService.pizzagna;

        formPizzagna = immutableSet(
            formPizzagna,
            `${PizzagnaLayer.Data}.columns.properties.columns`,
            columns ?? []
        );
        formPizzagna = immutableSet(
            formPizzagna,
            `${PizzagnaLayer.Data}.columns.properties.dataFields`,
            dataFields
        );

        this.updateFormPizzagna(formPizzagna);
    }

    public toPreview(form: FormGroup): void {
        // table configurator v2 doesn't have `columnsOutput`, it just uses `columns` as source of truth
        const formControl = form.contains("columnsOutput")
            ? form.get("columnsOutput")
            : form.get("columns");

        if (!formControl) {
            throw new Error("FormControl is not defined!");
        }

        formControl.valueChanges
            .pipe(takeUntil(this.destroy$), distinctUntilChanged(isEqual))
            .subscribe((columns: ITableWidgetColumnConfig[]) => {
                const columnsPath = "table.properties.configuration.columns";

                // need to wait till forms are initialized in case of creating new column
                setTimeout(() => {
                    const preview = this.getPreview();
                    this.updatePreview(
                        immutableSet(preview, columnsPath, columns)
                    );
                });

                let formPizzagna = this.pizzagnaService.pizzagna;

                // using setTimeout here updates the "filters" component properly - without it it doesn't update the dropdown with sortable columns
                setTimeout(() => {
                    // hackfix for NUI-5712
                    // this assigment resolves a race condition that sometimes occured when data fields received from the data source would be
                    // overwritten by an "older" formPizzagna value assigned above
                    formPizzagna = immutableSet(
                        formPizzagna,
                        `${PizzagnaLayer.Structure}.columns.properties.template`,
                        this.pizzagnaService.pizzagna[PizzagnaLayer.Structure]
                            .columns.properties?.template
                    );

                    formPizzagna = immutableSet(
                        formPizzagna,
                        `${PizzagnaLayer.Data}.filters.properties.columns`,
                        columns
                    );
                    // this triggers change detection on the "filters" component
                    formPizzagna = immutableSet(
                        formPizzagna,
                        `${PizzagnaLayer.Structure}.presentation.properties.nodes`,
                        [
                            ...(formPizzagna?.structure?.presentation
                                ?.properties?.nodes ?? []),
                        ]
                    );

                    this.updateFormPizzagna(formPizzagna);
                });
            });

        this.subscribeToColumnsValueChange();
    }

    private subscribeToColumnsValueChange() {
        this.component.form
            .get("columnsOutput")
            ?.valueChanges.pipe(
                // trigger subscription after tableColumnsFormArray is filled with values
                // eslint-disable-next-line import/no-deprecated
                startWith(this.component.form.get("columnsOutput").value),
                filter((columns: IItemConfiguration[]) => columns.length > 0),
                tap(() => this.handleWidthValidation()),
                map((columns: ITableWidgetColumnConfig[]) =>
                    this.filterColumnsWithoutSpecifiedWidth(columns)
                ),
                map((activeColumnsWithoutWidth: ITableWidgetColumnConfig[]) =>
                    this.handleColumnsWithoutSpecifiedWidth(
                        activeColumnsWithoutWidth
                    )
                ),
                distinctUntilKeyChanged("id"),
                pluck("id"),
                takeUntil(this.destroy$)
            )
            .subscribe((columnId: string) => this.setWidthMessages(columnId));
    }

    /**
     * Filters columns which are active (visible) and don't have specified width
     * @param columns
     */
    private filterColumnsWithoutSpecifiedWidth(
        columns: ITableWidgetColumnConfig[]
    ) {
        return columns.filter((column) => column.isActive && !column.width);
    }

    /**
     * Receives columns which are active and don't have specified width and returns:
     * - if all columns have specified width, reset width of the last column and return its id
     * - if there are only one column, set this columns id as last without specified width
     * - if there are more than one column that don't have specified width, do nothing
     * @param activeColumnsWithoutWidth
     */
    private handleColumnsWithoutSpecifiedWidth(
        activeColumnsWithoutWidth: Array<ITableWidgetColumnConfig>
    ) {
        switch (activeColumnsWithoutWidth.length) {
            // if all columns have specified width, reset last columns value so that other columns can resize
            case 0: {
                const activeColumns = (
                    this.component.form.get("columns") as FormArray
                ).controls.filter((control) =>
                    get(
                        control,
                        `value.properties[${control.value.id}/description].isActive`
                    )
                );
                if (isEmpty(activeColumns)) {
                    return {
                        id: undefined,
                        label: undefined,
                    };
                }
                const lastActiveColumn =
                    activeColumns[activeColumns.length - 1];
                console.warn(
                    `Cannot set width for all columns. Resetting "${lastActiveColumn.value.label}" width.`
                );
                lastActiveColumn.patchValue(
                    { width: null },
                    { emitEvent: false }
                );
                return lastActiveColumn.value;
            }
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
        (this.component.form.get("columns") as FormArray).controls.forEach(
            (formGroup: AbstractControl) => {
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
                    widthFormField?.updateValueAndValidity({
                        emitEvent: false,
                    });
                } else {
                    widthFormField?.clearValidators();
                    widthFormField?.updateValueAndValidity({
                        emitEvent: false,
                    });
                }
            }
        );
    }

    private setWidthMessages(columnId: string) {
        if (!this.pizzagnaService.pizzagna) {
            return;
        }

        const widthMessageInput = "isWidthMessageDisplayed";
        const { pizzagna } = this.pizzagnaService;
        const columns = pizzagna.data.columns.properties?.columns;
        columns.forEach((col: ITableWidgetColumnConfig) =>
            this.pizzagnaService.setProperty(
                `${PizzagnaLayer.Data}.${col.id}/description.properties.${widthMessageInput}`,
                false
            )
        );

        if (!columnId) {
            return;
        }
        this.pizzagnaService.setProperty(
            `${PizzagnaLayer.Data}.${columnId}/description.properties.${widthMessageInput}`,
            true
        );
    }
}
