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
import { AbstractControl, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { uuid } from "@solarwinds/nova-bits";
import values from "lodash/values";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

import { IDataField, ITableWidgetColumnConfig } from "../../../../../components/table-widget/types";
import { IFormatterDefinition } from "../../../../../components/types";
import { IPizzagnaProperty } from "../../../../../pizzagna/functions/get-pizzagna-property-path";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { IHasForm, PizzagnaLayer } from "../../../../../types";

@Component({
    selector: "nui-table-columns-configuration",
    templateUrl: "./table-columns-configuration.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnsConfigurationComponent implements OnInit, IHasForm, OnChanges, OnDestroy {
    static lateLoadKey = "TableColumnsConfigurationComponent";

    @Input() columns: ITableWidgetColumnConfig[] = [];
    @Input() formatters: Array<IFormatterDefinition> = [];
    @Input() componentId: string;
    @Input() dataFields: Array<IDataField> = [];
    @Input() nodes: string[];

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public emptyColumns$: Observable<boolean>;

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(private formBuilder: FormBuilder,
                private changeDetector: ChangeDetectorRef,
                private pizzagnaService: PizzagnaService) {
    }

    public ngOnInit() {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.dataFields && changes.dataFields.currentValue) {
            this.updateColumns(changes.dataFields.currentValue);
            setTimeout(() => this.changeDetector.markForCheck());
        }
    }

    public onFormReady(form: AbstractControl) {
        this.form = this.formBuilder.group({
            columns: form as FormArray,
        });
        this.emptyColumns$ = this.form.valueChanges.pipe(map(result => result.columns.length === 0));
        this.formReady.emit(this.form);
    }

    public onItemsChange(columns: ITableWidgetColumnConfig[]) {
        const parentPath = "columns";
        const componentIds = columns.map(tile => tile.id);
        this.pizzagnaService.createComponentsFromTemplate(parentPath, componentIds);

        const property: IPizzagnaProperty = {
            componentId: this.componentId,
            pizzagnaKey: PizzagnaLayer.Data,
            propertyPath: ["columns"],
        };
        this.pizzagnaService.setProperty(property, columns);
    }

    public addColumn() {
        // @ts-ignore: Types of property 'formatter' are incompatible.
        this.onItemsChange([...this.columns, {
            id: uuid("column"),
            label: "",
            // TODO: Provide proper formatter null is not assignable to IFormatter
            formatter: null,
        }]);
    }

    private updateColumns(currentDatafields: IDataField[]) {
        const currentDatafieldIds = currentDatafields.map(datafield => datafield.id);
        const newColumns = this.columns.filter(column => {
            if (!column.formatter?.properties?.dataFieldIds) {
                return false;
            }
            return values(column.formatter?.properties?.dataFieldIds).some((datafield: string) => currentDatafieldIds.includes(datafield));
        });

        this.onItemsChange(newColumns);
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
