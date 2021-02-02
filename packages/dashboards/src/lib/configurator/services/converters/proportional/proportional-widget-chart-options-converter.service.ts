import { AfterViewInit, Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";
import { takeUntil } from "rxjs/operators";

import { IProportionalWidgetChartOptions } from "../../../../components/proportional-widget/types";
import { LegendPlacement } from "../../../../components/types";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../../../types";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

@Injectable()
export class ProportionalWidgetChartOptionsConverterService extends BaseConverter implements AfterViewInit {
    private readonly PROPERTIES_PATH = `${PizzagnaLayer.Configuration}.chartOptionsEditor.properties`;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                previewService: PreviewService,
                pizzagnaService: PizzagnaService) {
        super(eventBus, previewService, pizzagnaService);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }

    public buildForm(): void {
        const chartOptions: IProportionalWidgetChartOptions = this.getPreview().chart?.properties?.configuration?.chartOptions;
        let editorPizzagna = this.pizzagnaService.pizzagna;

        editorPizzagna = immutableSet(
            editorPizzagna, `${this.PROPERTIES_PATH}.chartType`, chartOptions?.type ?? undefined);

        editorPizzagna = immutableSet(editorPizzagna,
            `${this.PROPERTIES_PATH}.legendPlacement`, chartOptions?.legendPlacement ?? LegendPlacement.None);

        editorPizzagna = immutableSet(editorPizzagna,
            `${this.PROPERTIES_PATH}.legendFormatterComponentType`, chartOptions?.legendFormatter?.componentType ?? "");

        editorPizzagna = immutableSet(editorPizzagna,
            `${this.PROPERTIES_PATH}.contentFormatterComponentType`, chartOptions?.contentFormatter?.componentType ?? "DonutContentRawFormatterComponent");

        editorPizzagna = immutableSet(editorPizzagna,
            `${this.PROPERTIES_PATH}.contentFormatterProperties`, chartOptions?.contentFormatter?.properties ?? "");

        this.updateFormPizzagna(editorPizzagna);
    }


    public toPreview(form: FormGroup): void {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(chartOptions => {
                const preview = immutableSet(this.getPreview(), "chart.properties.configuration.chartOptions", chartOptions);
                this.updatePreview(preview);
            });
    }
}
