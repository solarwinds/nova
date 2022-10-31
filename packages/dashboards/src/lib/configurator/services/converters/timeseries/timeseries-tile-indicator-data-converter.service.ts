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

import { Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import get from "lodash/get";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";

import { ITimeseriesWidgetSeries } from "../../../../components/timeseries-widget/types";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import {
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
    WellKnownProviders,
} from "../../../../types";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

@Injectable()
export class TimeseriesTileIndicatorDataConverterService extends BaseConverter {
    private previewSeriesPath = `chart.providers.${WellKnownProviders.Adapter}.properties.series`;

    private get previewComponentId() {
        return this.componentId.split("/")[0];
    }

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        previewService: PreviewService,
        pizzagnaService: PizzagnaService
    ) {
        super(eventBus, previewService, pizzagnaService);
    }

    public buildForm() {
        const series = get(
            this.getPreview(),
            this.previewSeriesPath,
            []
        ) as ITimeseriesWidgetSeries[];
        const currentSeries = series.find(
            (s) => s.id === this.previewComponentId
        );
        const selectedSeriesId =
            currentSeries && currentSeries.selectedSeriesId;

        const updatedPizzagna = immutableSet(
            this.pizzagnaService.pizzagna,
            `${PizzagnaLayer.Data}.${this.componentId}.properties`,
            { selectedSeriesId }
        );
        this.updateFormPizzagna(updatedPizzagna);
    }

    public toPreview(form: FormGroup) {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((formData) => {
                const selectedSeriesId = formData.id;
                const preview = this.getPreview();

                const seriesFromPreview = get(
                    preview,
                    this.previewSeriesPath,
                    []
                ) as ITimeseriesWidgetSeries[];
                const currentSeriesIndex = seriesFromPreview.findIndex(
                    (s) => s.id === this.previewComponentId
                );

                if (currentSeriesIndex > -1) {
                    const newSeries = [...seriesFromPreview];
                    newSeries[currentSeriesIndex] = {
                        ...newSeries[currentSeriesIndex],
                        selectedSeriesId,
                    };

                    const updatedPreview = immutableSet(
                        preview,
                        `${this.previewSeriesPath}`,
                        newSeries
                    );
                    this.updatePreview(updatedPreview);
                }
            });
    }
}
