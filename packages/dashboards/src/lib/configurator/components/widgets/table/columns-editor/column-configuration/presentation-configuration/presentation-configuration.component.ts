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
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SimpleChanges,
} from "@angular/core";
import {
    ControlContainer,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from "@angular/forms";
import capitalize from "lodash/capitalize";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { IDataField } from "@nova-ui/bits";

import {
    IFormatter,
    IFormatterConfigurator,
    IFormatterDefinition,
} from "../../../../../../../components/types";
import {
    FormatterRegistryService,
    TableFormatterRegistryService,
} from "../../../../../../../services/table-formatter-registry.service";
import {
    FORMATTERS_REGISTRY,
    IHasChangeDetector,
} from "../../../../../../../types";
import { ConfiguratorHeadingService } from "../../../../../../services/configurator-heading.service";

@Component({
    selector: "nui-table-column-presentation-configuration",
    templateUrl: "./presentation-configuration.component.html",
    styleUrls: ["./presentation-configuration.component.less"],
    viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationConfigurationComponent
    implements IHasChangeDetector, OnInit, OnDestroy, OnChanges, AfterViewInit
{
    static lateLoadKey = "PresentationConfigurationComponent";

    private _providedFormatters: Array<IFormatterDefinition> = [];
    private _formatters: Array<IFormatterDefinition> = [];
    @Input() formatter: IFormatter;

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
    @Input()
    public set dataFields(dataFields: Array<IDataField>) {
        this._dataFields = dataFields;
        this.updateAvailableFormatters();
    }

    public get dataFields(): IDataField[] {
        return this._dataFields;
    }

    @Output() formReady: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();
    @Output() formDestroy: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();

    public form: FormGroup;
    public formatterForm: FormGroup = this.formBuilder.group({});

    public formatterConfigurator: string | null;
    public formatterConfiguratorProps: IFormatterConfigurator;
    public readonly formatterFormGroupName = "formatter";
    public subtitleText: string;
    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        public changeDetector: ChangeDetectorRef,
        public configuratorHeading: ConfiguratorHeadingService,
        @Optional()
        @Inject(FORMATTERS_REGISTRY)
        private formattersRegistryCommon: FormatterRegistryService,
        // used as a fallback, remove in vNext
        /**
         * @deprecated  will be removed in the scope of NUI-5839
         */
        private tableFormattersRegistryService: TableFormatterRegistryService
    ) {
        this.subscribeToFormattersRegistry();
    }

    ngOnInit(): void {
        this.formatterForm = this.formBuilder.group({
            componentType: [
                (this.formatter && this.formatter.componentType) ||
                    (this._providedFormatters &&
                        this._providedFormatters.length > 0 &&
                        this._providedFormatters[0].componentType),
                [Validators.required],
            ],
        });
        this.form = this.formBuilder.group({
            [this.formatterFormGroupName]: this.formatterForm,
        });

        this.formatterForm
            .get("componentType")
            ?.valueChanges.pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.createFormatterConfigurator());

        this.createFormatterConfigurator();
        this.formReady.emit(this.form);
        this.formatterForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.updateSubtitle();
                this.changeDetector.detectChanges();
            });
    }

    ngAfterViewInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.dataFieldIds) {
            const { currentValue, previousValue } = changes.dataFieldIds;

            if (currentValue && currentValue !== previousValue) {
                const dataFields = currentValue.map(
                    (df: string) =>
                        ({
                            id: df,
                            label: capitalize(df),
                        } as IDataField)
                );

                this.dataFields = dataFields;
                this.updateSubtitle();
            }
        }

        if (changes.formatter) {
            this.form?.patchValue(
                {
                    [this.formatterFormGroupName]:
                        changes.formatter.currentValue,
                },
                { emitEvent: false }
            );
            this.updateSubtitle();
        }

        if (
            changes.dataFields &&
            changes.dataFields.previousValue.length === 0 &&
            this.formatterForm
        ) {
            this.updateSubtitle();
        }
    }

    public getSelectedFormatterDefinition(): IFormatterDefinition | null {
        if (this._providedFormatters.length > 0) {
            const formatterId = this.formatterForm.get("componentType")?.value;
            return (
                this._providedFormatters.find(
                    (formatter) => formatter.componentType === formatterId
                ) ?? null
            );
        }
        return null;
    }

    public getSelectedDataField(): IDataField | null {
        const propertiesControl = this.formatterForm.controls["properties"];
        if (
            propertiesControl &&
            this.dataFields &&
            this.dataFields.length > 0
        ) {
            const dataFieldId =
                propertiesControl.get("dataFieldIds")?.value.value;
            return (
                this.dataFields.find(
                    (dataField) => dataField.id === dataFieldId
                ) ?? null
            );
        }
        return null;
    }

    public onFormReady(form: FormGroup) {
        (this.form.get(this.formatterFormGroupName) as FormGroup).setControl(
            "properties",
            form
        );
    }

    private updateSubtitle() {
        this.subtitleText = `${this.getSelectedFormatterDefinition()?.label}`;
        if (this.getSelectedDataField()) {
            this.subtitleText = this.subtitleText.concat(
                `, ${this.getSelectedDataField()?.label}`
            );
        }
    }

    /**
     * Creates portal for dynamic configuration of formatter value.
     * @returns ComponentPortal
     */
    private createFormatterConfigurator() {
        const formatterDefinition = this._providedFormatters.find(
            (formatter) =>
                formatter.componentType ===
                this.formatterForm.get("componentType")?.value
        );

        // if configurationComponent property is present in formatters configuration, use it to render portal,
        // otherwise, use default ValueSelectorComponent
        if (formatterDefinition) {
            this.formatterConfigurator =
                formatterDefinition.configurationComponent ??
                "ValueSelectorComponent";
        } else {
            this.formatterConfigurator = null;
        }

        // if the currently selected component doesn't match the original value from the input then we reset the form values
        if (
            formatterDefinition?.componentType !==
                this.formatter?.componentType &&
            this.formatter?.properties?.dataFieldIds
        ) {
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
        this._dataFields.forEach((f) => (sourceDataTypes[f.dataType] = true));
        this._formatters = this._providedFormatters.filter((f) => {
            // cast to array in case we have a single value
            const formatterDataTypes =
                f.dataTypes.value instanceof Array
                    ? f.dataTypes.value
                    : [f.dataTypes.value];

            return formatterDataTypes.some((v) => sourceDataTypes[v]);
        });
        if (this.formatterForm) {
            this.createFormatterConfigurator();
        }
    }

    private subscribeToFormattersRegistry(): void {
        this.handleFormattersUpdate(this.formattersRegistry.getItems());

        this.formattersRegistry.stateChanged$
            .pipe(
                tap(this.handleFormattersUpdate.bind(this)),
                takeUntil(this.onDestroy$)
            )
            .subscribe();
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
        return (
            this.formattersRegistryCommon || this.tableFormattersRegistryService
        );
    }

    ngOnDestroy(): void {
        this.formDestroy.emit(this.form);
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
