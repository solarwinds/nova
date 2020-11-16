import { AfterViewInit, Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EventBus, IEvent, immutableSet, TimeframeService } from "@solarwinds/nova-bits";
import get from "lodash/get";
import { takeUntil } from "rxjs/operators";

import { ITimeseriesWidgetConfig } from "../../../../components/timeseries-widget/types";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../../../types";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

@Injectable()
export class TimeseriesMetadataConverterService extends BaseConverter implements AfterViewInit {

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                previewService: PreviewService,
                pizzagnaService: PizzagnaService,
                private timeframeService: TimeframeService) {
        super(eventBus, previewService, pizzagnaService);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }

    public buildForm(): void {
        let formPizzagna = this.pizzagnaService.pizzagna;
        const preview = this.getPreview();
        const timeSpans = Object.keys(this.timeframeService.currentPresets)
            .map(k => ({ id: k, name: this.timeframeService.currentPresets[k].name }));

        const propertyPrefix = `${PizzagnaLayer.Data}.timeseriesMetadata.properties`;
        formPizzagna = immutableSet(formPizzagna, `${propertyPrefix}.timeSpans`, timeSpans);

        const selectedPresetId = get(preview, `timeframeSelection.properties.timeframe.selectedPresetId`, "last7Days") as unknown as string;
        const selectedTimeSpan = timeSpans.find((timeSpan) => timeSpan.id === selectedPresetId);
        if (selectedTimeSpan) {
            formPizzagna = immutableSet(formPizzagna, `${propertyPrefix}.startingTimespan`, selectedTimeSpan);
        }

        const configuration = get(preview, `chart.properties.configuration`) as unknown as ITimeseriesWidgetConfig;
        if (configuration) {
            formPizzagna = immutableSet(formPizzagna, `${propertyPrefix}.legendPlacement`, configuration.legendPlacement);
            formPizzagna = immutableSet(formPizzagna, `${propertyPrefix}.leftAxisLabel`, configuration.leftAxisLabel);
            formPizzagna = immutableSet(formPizzagna, `${propertyPrefix}.preset`, configuration.preset);
        }

        this.updateFormPizzagna(formPizzagna);
    }

    public toPreview(form: FormGroup): void {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => {
                let preview = this.getPreview();

                const presetId = get(value, "startingTimespan.id");
                if (presetId) {
                    preview = immutableSet(preview, "timeframeSelection.properties.timeframe.selectedPresetId", presetId);
                }

                const chartConfig = `chart.properties.configuration`;
                preview = immutableSet(preview, `${chartConfig}.legendPlacement`, get(value, "legendPlacement", ""));
                preview = immutableSet(preview, `${chartConfig}.leftAxisLabel`, get(value, "leftAxisLabel", ""));
                preview = immutableSet(preview, `${chartConfig}.preset`, get(value, "preset", ""));

                this.updatePreview(preview);
            });
    }
}
