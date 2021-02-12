import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    SimpleChanges
} from "@angular/core";
import { ControlContainer, ControlValueAccessor, FormBuilder, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { EventBus, IEvent } from "@nova-ui/bits";
import isUndefined from "lodash/isUndefined";
import { Subject, Subscription } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { IDataSourceOutput } from "../../../../../../../components/providers/types";
import { IDataField } from "../../../../../../../components/table-widget/types";
import { IFormatter, IFormatterConfigurator, IFormatterDefinition } from "../../../../../../../components/types";
import { FormatterRegistryService, TableFormatterRegistryService } from "../../../../../../../services/table-formatter-registry.service";
import { FORMATTERS_REGISTRY, IHasChangeDetector, PIZZAGNA_EVENT_BUS } from "../../../../../../../types";
import { DATA_SOURCE_OUTPUT } from "../../../../../../types";

@Component({
    selector: "nui-table-column-presentation-configuration-v2",
    templateUrl: "./presentation-configuration-v2.component.html",
    styleUrls: ["./presentation-configuration-v2.component.less"],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PresentationConfigurationV2Component),
            multi: true,
        },
    ],
})
export class PresentationConfigurationV2Component implements IHasChangeDetector, OnInit, OnDestroy, OnChanges, ControlValueAccessor {
    static lateLoadKey = "PresentationConfigurationV2Component";

    private _providedFormatters: Array<IFormatterDefinition> = [];
    private _formatters: Array<IFormatterDefinition> = [];
    private changeFn: Function;
    private propertiesValueChangeSubscription?: Subscription;
    private input: IFormatter;

    @Input()
    public set formatters(formatters: Array<IFormatterDefinition>) {
        // Note: As discussed we will ignore the config formatters if
        // the user already provided formatters via registry
        if (!this.tableFormattersRegistryService.isEmpty) {
            return;
        }
        this.handleFormattersUpdate(formatters);
    }

    public get formatters() {
        return this._formatters;
    }

    @Input() public dataFieldIds: string[];

    private _dataFields: Array<IDataField> = [];

    public set dataFields(dataFields: Array<IDataField>) {
        this._dataFields = dataFields;
        this.updateAvailableFormatters();
    }

    public get dataFields(): IDataField[] {
        return this._dataFields;
    }

    public get formatter(): IFormatter {
        return this.formatterForm.value;
    }

    public form: FormGroup;
    public formatterForm: FormGroup = this.formBuilder.group({});
    public propertiesForm: FormGroup;

    public formatterConfigurator: string | null;
    public formatterConfiguratorProps: IFormatterConfigurator;
    public readonly formatterFormGroupName = "formatter";
    public subtitleText: string;
    private onDestroy$: Subject<void> = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        public changeDetector: ChangeDetectorRef,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        @Optional() @Inject(FORMATTERS_REGISTRY) private formattersRegistryCommon: FormatterRegistryService,
        // used as a fallback, remove in vNext
        private tableFormattersRegistryService: TableFormatterRegistryService) {
        this.subscribeToFormattersRegistry();

        this.formatterForm = this.formBuilder.group({
            "componentType":
                [(this.formatter && this.formatter.componentType) ||
                (this._providedFormatters && this._providedFormatters.length > 0 && this._providedFormatters[0].componentType), [Validators.required]],
        });
        this.form = this.formBuilder.group({
            [this.formatterFormGroupName]: this.formatterForm,
        });

        this.formatterForm.get("componentType")?.valueChanges.pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.createFormatterConfigurator());

        this.createFormatterConfigurator();
        this.formatterForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.updateSubtitle();
                this.onValueChange();
                this.changeDetector.detectChanges();
            });

        this.eventBus.subscribeUntil(DATA_SOURCE_OUTPUT, this.onDestroy$, (event: IEvent<any | IDataSourceOutput<any>>) => {
            const { dataFields } = isUndefined(event.payload.result) ? event.payload : (event.payload.result || {});

            this.dataFields = dataFields;
        });
    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    public ngOnChanges(changes: SimpleChanges) {
        //     if (changes.dataFieldIds) {
        //         const { currentValue, previousValue } = changes.dataFieldIds;
        //
        //         if (currentValue && currentValue !== previousValue) {
        //             const dataFields = currentValue.map((df: string) => ({
        //                 id: df,
        //                 label: capitalize(df),
        //             } as IDataField));
        //
        //             this.dataFields = dataFields;
        //             this.updateSubtitle();
        //         }
        //     }
        //
        //     if (changes.dataFields && changes.dataFields.previousValue.length === 0 && this.formatterForm) {
        //         this.updateSubtitle();
        //     }
        //
        //     if (changes.formatter) {
        //         this.form?.patchValue({ [this.formatterFormGroupName]: changes.formatter.currentValue }, { emitEvent: false });
        //         this.updateSubtitle();
        //     }
    }

    public registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    public registerOnTouched(fn: any): void {
    }

    public setDisabledState(isDisabled: boolean): void {
    }

    public writeValue(obj: IFormatter): void {
        this.input = obj;
        // console.log("PresentationConfigurationV2", obj);
    }

    public getSelectedFormatterDefinition(): IFormatterDefinition | null {
        if (this._providedFormatters.length > 0) {
            const formatterId = this.formatterForm.get("componentType")?.value;
            return this._providedFormatters.find(formatter => formatter.componentType === formatterId) ?? null;
        }
        return null;
    }

    public getSelectedDataField(): IDataField | null {
        const propertiesControl = this.formatterForm.controls["properties"];
        if (propertiesControl && this.dataFields && this.dataFields.length > 0) {
            const dataFieldId = propertiesControl.get("dataFieldIds")?.value.value;
            return this.dataFields.find(dataField => dataField.id === dataFieldId) ?? null;
        }
        return null;
    }

    public onFormReady(form: FormGroup) {
        if (this.propertiesValueChangeSubscription) {
            this.propertiesValueChangeSubscription.unsubscribe();
            this.propertiesValueChangeSubscription = undefined;
        }

        this.propertiesForm = form;
        if (this.input.componentType === this.formatter.componentType) {
            this.propertiesForm.setValue(this.input.properties, { emitEvent: false });
        }
        this.propertiesValueChangeSubscription = this.propertiesForm.valueChanges.subscribe(() => {
            this.onValueChange();
        });
    }

    public onValueChange() {
        if (!this.changeFn) {
            return;
        }

        this.changeFn({
            ...this.formatterForm.value,
            properties: this.propertiesForm.value,
        });
    }

    private updateSubtitle() {
        this.subtitleText = `${this.getSelectedFormatterDefinition()?.label}`;
        if (this.getSelectedDataField()) {
            this.subtitleText = this.subtitleText.concat(`, ${this.getSelectedDataField()?.label}`);
        }
    }

    /**
     * Creates portal for dynamic configuration of formatter value.
     * @returns ComponentPortal
     */
    private createFormatterConfigurator() {
        const formatterDefinition = this._providedFormatters.find(
            formatter => formatter.componentType === this.formatterForm.get("componentType")?.value
        );

        // if configurationComponent property is present in formatters configuration, use it to render portal,
        // otherwise, use default ValueSelectorComponent
        if (formatterDefinition) {
            this.formatterConfigurator = formatterDefinition.configurationComponent ?? "ValueSelectorComponent";
        } else {
            this.formatterConfigurator = null;
        }

        // if the currently selected component doesn't match the original value from the input then we reset the form values
        if (formatterDefinition?.componentType !== this.formatter?.componentType && this.formatter?.properties?.dataFieldIds) {
            this.formatter.properties.dataFieldIds = { value: null };
        }

        this.formatterConfiguratorProps = {
            dataFields: this.dataFields,
            formatter: this.formatter,
            // TODO: Ensure that formatterDefinition is not undefined
            formatterDefinition: formatterDefinition as IFormatterDefinition,
        };
    }

    private updateAvailableFormatters() {
        if (!this._dataFields.length || !this._providedFormatters.length) {
            return;
        }

        // allow by default RawFormatter which has null as dataType
        const sourceDataTypes: Record<string, boolean> = { null: true };
        this._dataFields.forEach(f => sourceDataTypes[f.dataType] = true);
        this._formatters = this._providedFormatters.filter(
            (f) => {
                // cast to array in case we have a single value
                const formatterDataTypes = f.dataTypes.value instanceof Array
                    ? f.dataTypes.value
                    : [f.dataTypes.value];

                return formatterDataTypes.some(v => sourceDataTypes[v]);
            }
        );
        if (this.formatterForm) {
            this.createFormatterConfigurator();
        }
    }

    private subscribeToFormattersRegistry(): void {
        this.handleFormattersUpdate(this.formattersRegistry.getItems());

        this.formattersRegistry.stateChanged$.pipe(
            tap(this.handleFormattersUpdate.bind(this)),
            takeUntil(this.onDestroy$)
        ).subscribe();
    }

    private handleFormattersUpdate(formatters: IFormatterDefinition[]): void {
        if (formatters !== this._providedFormatters) {
            this._providedFormatters = formatters;
            this.updateAvailableFormatters();
        }
    }

    /**
     * Fallback for table,
     *
     * nothing should go wrong, but in case "FORMATTERS_REGISTRY" is lost, get table registry
     */
    private get formattersRegistry() {
        return this.formattersRegistryCommon || this.tableFormattersRegistryService;
    }

}
