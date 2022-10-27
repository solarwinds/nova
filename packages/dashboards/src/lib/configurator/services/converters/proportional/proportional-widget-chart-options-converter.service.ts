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
import { FormGroup } from "@angular/forms";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";

import { IProportionalWidgetChartOptions } from "../../../../components/proportional-widget/types";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../../types";
import { LegendPlacement } from "../../../../widget-types/common/widget/legend";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

@Injectable()
export class ProportionalWidgetChartOptionsConverterService
    extends BaseConverter
    implements AfterViewInit
{
    private readonly PROPERTIES_PATH = `${PizzagnaLayer.Configuration}.chartOptionsEditor.properties`;

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        previewService: PreviewService,
        pizzagnaService: PizzagnaService
    ) {
        super(eventBus, previewService, pizzagnaService);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }

    public buildForm(): void {
        const chartOptions: IProportionalWidgetChartOptions =
            this.getPreview().chart?.properties?.configuration?.chartOptions;
        let editorPizzagna = this.pizzagnaService.pizzagna;

        editorPizzagna = immutableSet(
            editorPizzagna,
            `${this.PROPERTIES_PATH}.chartType`,
            chartOptions?.type ?? undefined
        );

        editorPizzagna = immutableSet(
            editorPizzagna,
            `${this.PROPERTIES_PATH}.legendPlacement`,
            chartOptions?.legendPlacement ?? LegendPlacement.None
        );

        editorPizzagna = immutableSet(
            editorPizzagna,
            `${this.PROPERTIES_PATH}.legendFormatterComponentType`,
            chartOptions?.legendFormatter?.componentType ?? ""
        );

        editorPizzagna = immutableSet(
            editorPizzagna,
            `${this.PROPERTIES_PATH}.contentFormatterComponentType`,
            chartOptions?.contentFormatter?.componentType ??
                "DonutContentRawFormatterComponent"
        );

        editorPizzagna = immutableSet(
            editorPizzagna,
            `${this.PROPERTIES_PATH}.contentFormatterProperties`,
            chartOptions?.contentFormatter?.properties ?? ""
        );

        this.updateFormPizzagna(editorPizzagna);
    }

    public toPreview(form: FormGroup): void {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((chartOptions) => {
                const preview = immutableSet(
                    this.getPreview(),
                    "chart.properties.configuration.chartOptions",
                    chartOptions
                );
                this.updatePreview(preview);
            });
    }
}
