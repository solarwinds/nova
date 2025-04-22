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
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    IProportionalWidgetChartTypeConfiguration,
    ProportionalWidgetChartTypes,
} from "../../../../../components/proportional-widget/types";
import {
    IFormatter,
    IFormatterDefinition,
} from "../../../../../components/types";
import { ProportionalLegendFormattersRegistryService } from "../../../../../services/table-formatter-registry.service";
import { IHasChangeDetector, IHasForm } from "../../../../../types";
import { ILegendPlacementOption } from "../../../../../widget-types/common/widget/legend";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";

@Component({
    selector: "nui-proportional-chart-options-editor-v2-component",
    templateUrl: "proportional-chart-options-editor-v2.component.html",
    styleUrls: ["proportional-chart-options-editor-v2.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ProportionalChartOptionsEditorV2Component
    implements OnInit, IHasChangeDetector, IHasForm, OnChanges, OnDestroy
{
    static lateLoadKey = "ProportionalChartOptionsEditorV2Component";

    @Input() type: ProportionalWidgetChartTypes;
    @Input() legendPlacement: ILegendPlacementOption;
    @Input() legendFormatter: IFormatter;

    @Input() chartTypes: IProportionalWidgetChartTypeConfiguration[];
    @Input() legendPlacementOptions: ILegendPlacementOption[];
    public legendFormatters: IFormatterDefinition[];

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup = this.formBuilder.group({
        type: [undefined, Validators.required],
        legendPlacement: [undefined],
        legendFormatter: this.formBuilder.group({
            componentType: [undefined],
        }),
    });
    // used by Broadcaster
    public chartTypeChanged$ = new Subject<ProportionalWidgetChartTypes>();

    private readonly destroy$ = new Subject<void>();

    constructor(
        public changeDetector: ChangeDetectorRef,
        public configuratorHeading: ConfiguratorHeadingService,
        private formBuilder: FormBuilder,
        legendFormattersRegistry: ProportionalLegendFormattersRegistryService
    ) {
        this.legendFormatters = legendFormattersRegistry.getItems();

        // broadcast chart type
        this.form.controls["type"].valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((v) => this.chartTypeChanged$.next(v));
    }

    public ngOnInit(): void {
        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.type) {
            this.form.controls["type"].setValue(changes.type.currentValue);
        }

        if (changes.legendPlacement) {
            this.form.controls["legendPlacement"].setValue(
                changes.legendPlacement.currentValue
            );
        }

        if (changes.legendFormatter) {
            this.form
                .get("legendFormatter.componentType")
                ?.setValue(changes.legendFormatter.currentValue.componentType);
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.chartTypeChanged$.complete();
    }

    public get chartTitle(): string | undefined {
        const currentChartType = this.form.get("type")?.value;
        const currentChartTypeDefinition = this.chartTypes.find(
            (chartType) => chartType.id === currentChartType
        );
        return currentChartTypeDefinition?.label;
    }

    public get legendFormatterControl(): FormControl {
        return this.form.get("legendFormatter.componentType") as FormControl;
    }
}
