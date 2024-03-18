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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";

import { EventBus, IEvent } from "@nova-ui/bits";

import { CartesianChartPreset } from "../../../../../components/cartesian-widget/types";
import {
    IHasChangeDetector,
    IHasForm,
    PIZZAGNA_EVENT_BUS,
} from "../../../../../types";
import { LegendPlacement } from "../../../../../widget-types/common/widget/legend";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";

export interface ICartesianChartTypeOption {
    label: string;
    value: CartesianChartPreset;
}

@Component({
    selector: "nui-cartesian-metadata-configuration",
    templateUrl: "./cartesian-metadata-configuration.component.html",
    styleUrls: ["./cartesian-metadata-configuration.component.less"],
})
export class CartesianMetadataConfigurationComponent
    implements IHasChangeDetector, IHasForm, OnInit, OnChanges, OnDestroy
{
    static lateLoadKey = "CartesianMetadataConfigurationComponent";

    @Input() legendPlacements: LegendPlacement[] = [];
    @Input() startingTimespan: any;
    @Input() legendPlacement: LegendPlacement;
    @Input() leftAxisLabel: string;
    @Input() preset: CartesianChartPreset;
    @Input() availableChartTypes: ICartesianChartTypeOption[] = [
        {
            label: $localize`Line`,
            value: CartesianChartPreset.Line,
        },
        {
            label: $localize`Stacked line`,
            value: CartesianChartPreset.StackedArea,
        },
        {
            label: $localize`Stacked % line`,
            value: CartesianChartPreset.StackedPercentageArea,
        },
        {
            label: $localize`Bar`,
            value: CartesianChartPreset.Bar,
        },
        { label: $localize`Stacked Bar`, value: CartesianChartPreset.StackedBar },
    ];

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;

    private readonly destroy$ = new Subject<void>();

    constructor(
        public changeDetector: ChangeDetectorRef,
        public configuratorHeading: ConfiguratorHeadingService,
        private formBuilder: FormBuilder,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>
    ) {
        this.form = this.formBuilder.group({
            leftAxisLabel: [""],
            legendPlacement: [LegendPlacement.None, [Validators.required]],
            preset: [CartesianChartPreset.Line, [Validators.required]],
        });
    }

    public ngOnInit(): void {
        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.leftAxisLabel) {
            this.form
                .get("leftAxisLabel")
                ?.setValue(this.leftAxisLabel, { emitEvent: false });
        }

        if (changes.legendPlacement) {
            this.form
                .get("legendPlacement")
                ?.setValue(this.legendPlacement, { emitEvent: false });
        }

        if (changes.preset) {
            this.form
                .get("preset")
                ?.setValue(this.preset, { emitEvent: false });
        }
    }

    public getSecondaryText(): string {
        const forLegend =
            this.form.controls["legendPlacement"].value || $localize`No legend`;
        const forAxisLabel =
            this.form.controls["leftAxisLabel"].value ||
            $localize`No y-axis label`;
        return `${forLegend}, ${forAxisLabel}`;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
