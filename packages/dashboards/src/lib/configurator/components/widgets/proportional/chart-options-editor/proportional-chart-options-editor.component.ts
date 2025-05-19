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
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import {
    IProportionalWidgetChartEditorOptions,
    ProportionalWidgetChartTypes,
} from "../../../../../components/proportional-widget/types";
import { IFormatterDefinition } from "../../../../../components/types";
import {
    IHasChangeDetector,
    IHasForm,
    IProperties,
} from "../../../../../types";
import { LegendPlacement } from "../../../../../widget-types/common/widget/legend";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";

type ChartTypeNamesMap = { [key in ProportionalWidgetChartTypes]: string };
const proportionalWidgetChartTypesNamesMap: ChartTypeNamesMap = {
    [ProportionalWidgetChartTypes.DonutChart]: $localize`Donut`,
    [ProportionalWidgetChartTypes.PieChart]: $localize`Pie`,
    [ProportionalWidgetChartTypes.VerticalBarChart]: $localize`Vertical Bar`,
    [ProportionalWidgetChartTypes.HorizontalBarChart]: $localize`Horizontal Bar`,
};
interface IChartOptionViewModel {
    label: string;
    value: ProportionalWidgetChartTypes;
}

@Component({
    selector: "nui-proportional-chart-options-editor-component",
    templateUrl: "proportional-chart-options-editor.component.html",
    styleUrls: ["proportional-chart-options-editor.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ProportionalChartOptionsEditorComponent
    implements IHasChangeDetector, IHasForm, OnInit, OnChanges
{
    static lateLoadKey = "ProportionalChartOptionsEditorComponent";

    @Input() chartOptions: IProportionalWidgetChartEditorOptions;
    @Input() chartType: ProportionalWidgetChartTypes;
    @Input() legendPlacement = LegendPlacement.None;
    @Input() legendFormatterComponentType: string;
    @Input() contentFormatterComponentType: string;
    @Input() contentFormatterProperties: IProperties | undefined;
    // filled by the Broadcaster
    @Input() dsOutput: any;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;

    public chartTypeNamesMap: ChartTypeNamesMap =
        proportionalWidgetChartTypesNamesMap;
    public legendFormatters: IFormatterDefinition[] = [];
    public contentFormatters: IFormatterDefinition[] = [];
    public formatterHasConfigurationComponent: boolean = false;
    public currentConfigurationComponent: string = "";
    public currentConfigurationComponentProperties: any;
    public chartFormatters: any = [];
    public configurationComponentProperties: any;

    private cachedChartOptionsViewModels: IChartOptionViewModel[] = [];
    private rawFormatter: IFormatterDefinition = {
        componentType: "",
        label: $localize`Raw`,
        dataTypes: {
            // @ts-ignore: pe 'null' is not as signable to type 'string | string[]'.
            value: null,
        },
    };

    constructor(
        public changeDetector: ChangeDetectorRef,
        public configuratorHeading: ConfiguratorHeadingService,
        private formBuilder: FormBuilder
    ) {}

    public get chartTypeSelectViewModels(): IChartOptionViewModel[] {
        // Using simple caching helper to prevent triggering values map on every CD cycle
        if (
            !this.cachedChartOptionsViewModels ||
            this.cachedChartOptionsViewModels.length !==
                this.chartOptions?.chartTypes?.length
        ) {
            this.cachedChartOptionsViewModels = (
                this.chartOptions?.chartTypes || []
            ).map((value) => ({ label: this.chartTypeNamesMap[value], value }));
        }
        return this.cachedChartOptionsViewModels;
    }

    public get chartTitle(): string {
        return this.chartTypeNamesMap[
            <ProportionalWidgetChartTypes>this.form.controls["type"].value
        ];
    }

    public getConfigurationComponent(): string {
        return (
            this.getCurrentFormatterDefinition()?.configurationComponent || ""
        );
    }

    public getConfigurationComponentProperties(): void {
        this.configurationComponentProperties = {
            contentFormatterProperties: this.contentFormatterProperties,
            contentFormatterDefinition: this.getCurrentFormatterDefinition(),
            dsOutput: this.dsOutput,
        };
    }

    public getCurrentFormatterDefinition(): IFormatterDefinition | undefined {
        const currentFormValue = this.form.get(
            "contentFormatter.componentType"
        )?.value;
        return this.contentFormatters.find(
            (item) => item.componentType === currentFormValue
        );
    }

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            type: [this.chartType || "", Validators.required],
            legendPlacement: this.legendPlacement,
            legendFormatter: this.formBuilder.group({
                componentType:
                    this.legendFormatterComponentType ||
                    this.rawFormatter.componentType,
            }),
            contentFormatter: this.formBuilder.group({
                componentType: this.contentFormatterComponentType,
                // the 'properties' control is being dynamically added here from the onFormReady() method
            }),
        });

        this.legendFormatters = [
            this.rawFormatter,
            ...(this.chartOptions.legendFormatters || []),
        ];
        this.contentFormatters = [
            ...(this.chartOptions.contentFormatters || []),
        ];

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.chartType && !changes.chartType.isFirstChange()) {
            this.form.get("type")?.setValue(changes.chartType.currentValue);
        }

        if (
            changes.legendPlacement &&
            !changes.legendPlacement.isFirstChange()
        ) {
            this.form
                .get("legendPlacement")
                ?.setValue(changes.legendPlacement.currentValue);
        }

        if (
            changes.legendFormatterComponentType &&
            !changes.legendFormatterComponentType.isFirstChange()
        ) {
            (this.form.get("legendFormatter") as FormGroup)
                .get("componentType")
                ?.setValue(this.legendFormatterComponentType);
        }

        if (
            changes.contentFormatterComponentType &&
            !changes.contentFormatterComponentType.isFirstChange()
        ) {
            (this.form.get("contentFormatter") as FormGroup)
                .get("componentType")
                ?.setValue(this.contentFormatterComponentType);
        }

        if (this.form) {
            this.getConfigurationComponentProperties();
        }
    }

    public onFormReady(payload: FormGroup): void {
        (this.form.get("contentFormatter") as FormGroup).setControl(
            "properties",
            payload
        );
    }
}
