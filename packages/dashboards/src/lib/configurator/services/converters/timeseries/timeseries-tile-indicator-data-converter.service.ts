import { Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";
import get from "lodash/get";
import { takeUntil } from "rxjs/operators";

import { ITimeseriesWidgetSeries } from "../../../../components/timeseries-widget/types";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS, PizzagnaLayer, WellKnownProviders } from "../../../../types";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

@Injectable()
export class TimeseriesTileIndicatorDataConverterService extends BaseConverter {
    private previewSeriesPath = `chart.providers.${WellKnownProviders.Adapter}.properties.series`;

    private get previewComponentId() {
        return this.componentId.split("/")[0];
    }

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                previewService: PreviewService,
                pizzagnaService: PizzagnaService) {
        super(eventBus, previewService, pizzagnaService);
    }

    public buildForm() {
        const series = get(this.getPreview(), this.previewSeriesPath, []) as ITimeseriesWidgetSeries[];
        const currentSeries = series.find(s => s.id === this.previewComponentId);
        const selectedSeriesId = currentSeries && currentSeries.selectedSeriesId;

        const updatedPizzagna = immutableSet(this.pizzagnaService.pizzagna, `${PizzagnaLayer.Data}.${this.componentId}.properties`, { selectedSeriesId });
        this.updateFormPizzagna(updatedPizzagna);
    }

    public toPreview(form: FormGroup) {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(formData => {
                const selectedSeriesId = formData.id;
                const preview = this.getPreview();

                const seriesFromPreview = get(preview, this.previewSeriesPath, []) as ITimeseriesWidgetSeries[];
                const currentSeriesIndex = seriesFromPreview.findIndex(s => s.id === this.previewComponentId);

                if (currentSeriesIndex > -1) {
                    const newSeries = [...seriesFromPreview];
                    newSeries[currentSeriesIndex] = {
                        ...newSeries[currentSeriesIndex],
                        selectedSeriesId,
                    };

                    const updatedPreview = immutableSet(preview, `${this.previewSeriesPath}`, newSeries);
                    this.updatePreview(updatedPreview);
                }
            });
    }
}
