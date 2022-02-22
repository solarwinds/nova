import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IProportionalWidgetChartTypeConfiguration, ProportionalWidgetChartTypes } from "../../../../../components/proportional-widget/types";
import { IFormatter, IFormatterDefinition } from "../../../../../components/types";
import { ProportionalLegendFormattersRegistryService } from "../../../../../services/table-formatter-registry.service";
import { IHasChangeDetector, IHasForm } from "../../../../../types";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";
import { ILegendPlacementOption } from "../../../../../widget-types/common/widget/legend"

@Component({
    selector: "nui-proportional-chart-options-editor-v2-component",
    templateUrl: "proportional-chart-options-editor-v2.component.html",
    styleUrls: ["proportional-chart-options-editor-v2.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProportionalChartOptionsEditorV2Component implements OnInit, IHasChangeDetector, IHasForm, OnChanges, OnDestroy {
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

    private destroy$ = new Subject();

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

    public ngOnInit() {
        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.type) {
            this.form.controls["type"].setValue(changes.type.currentValue);
        }

        if (changes.legendPlacement) {
            this.form.controls["legendPlacement"].setValue(changes.legendPlacement.currentValue);
        }

        if (changes.legendFormatter) {
            this.form.get("legendFormatter.componentType")?.setValue(changes.legendFormatter.currentValue.componentType);
        }
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.chartTypeChanged$.complete();
    }

    public get chartTitle() {
        const currentChartType: string = this.form.get("type")?.value;
        const currentChartTypeDefinition = this.chartTypes.find((chartType) => chartType.id === currentChartType);
        return currentChartTypeDefinition?.label;
    }

    public get legendFormatterControl(): FormControl {
        return this.form.get("legendFormatter.componentType") as FormControl;
    }

}
