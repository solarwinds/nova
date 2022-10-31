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

import { AfterViewInit, Inject, Injectable, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import isUndefined from "lodash/isUndefined";
import { combineLatest, Subject } from "rxjs";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";

import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";

import { IDataSourceOutput } from "../../../../components/providers/types";
import {
    ITimeseriesWidgetData,
    ITimeseriesWidgetSeries,
} from "../../../../components/timeseries-widget/types";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import {
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
    WellKnownProviders,
} from "../../../../types";
import { IItemConfiguration } from "../../../components/types";
import { ITimeseriesItemConfiguration } from "../../../components/widgets/timeseries/types";
import { DATA_SOURCE_CHANGE, DATA_SOURCE_OUTPUT } from "../../../types";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

@Injectable()
export class TimeseriesSeriesConverterService
    extends BaseConverter
    implements AfterViewInit, OnDestroy
{
    private indicatorDataKey = "indicatorData";
    private previewSeriesPath = `providers.${WellKnownProviders.Adapter}.properties.series`;
    private formSeriesComponentPath = `${PizzagnaLayer.Data}.series.properties`;

    private dataSourceSeries$ = new Subject<ITimeseriesWidgetData[]>();
    private selectedSeriesIds$ = new Subject<string[]>();
    private shouldReadForm = false;

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        previewService: PreviewService,
        pizzagnaService: PizzagnaService
    ) {
        super(eventBus, previewService, pizzagnaService);

        this.subscribeToAvailableDataFieldsChange();

        this.eventBus.subscribeUntil(DATA_SOURCE_CHANGE, this.destroy$, (v) => {
            const nodesPath = `${PizzagnaLayer.Structure}.series.properties.nodes`;
            const nodes = get(
                this.pizzagnaService.pizzagna,
                nodesPath
            ) as unknown as string[];
            this.pizzagnaService.removeComponents(nodes);

            let updatedPizzagna = this.pizzagnaService.pizzagna;
            updatedPizzagna = immutableSet(updatedPizzagna, nodesPath, []);
            updatedPizzagna = immutableSet(
                updatedPizzagna,
                `${this.formSeriesComponentPath}.series`,
                []
            );
            this.updateFormPizzagna(updatedPizzagna);
        });

        this.eventBus.subscribeUntil(
            DATA_SOURCE_OUTPUT,
            this.destroy$,
            (event: IEvent<any | IDataSourceOutput<any>>) => {
                // Because typing is lenient for the data source output, the event may or may not contain an IDataSourceOutput
                // with a result property; the payload may actually be the result itself, so both possibilities are accommodated.
                const { series } = isUndefined(event.payload.result)
                    ? event.payload
                    : event.payload.result || {};

                if (series) {
                    this.dataSourceSeries$.next(series);

                    let updatedPizzagna = this.pizzagnaService.pizzagna;
                    updatedPizzagna = immutableSet(
                        updatedPizzagna,
                        `${this.formSeriesComponentPath}.allSeries`,
                        series
                    );

                    const seriesTemplate =
                        this.pizzagnaService.pizzagna[PizzagnaLayer.Structure][
                            this.component.componentId
                        ].properties?.template;
                    const indicatorDataIndex = seriesTemplate.findIndex(
                        (val: IItemConfiguration) =>
                            val.id === this.indicatorDataKey
                    );
                    const indicatorDataPath = `${PizzagnaLayer.Structure}.series.properties.template[${indicatorDataIndex}].properties.allSeries`;
                    updatedPizzagna = immutableSet(
                        updatedPizzagna,
                        indicatorDataPath,
                        series
                    );

                    const previewSeries = get(
                        this.getPreview(),
                        `chart.${this.previewSeriesPath}`,
                        []
                    ) as ITimeseriesWidgetSeries[];
                    updatedPizzagna = previewSeries.reduce(
                        (res, s) =>
                            immutableSet(
                                res,
                                `${PizzagnaLayer.Data}.${s.id}/${this.indicatorDataKey}.properties.allSeries`,
                                series
                            ),
                        updatedPizzagna
                    );

                    this.updateFormPizzagna(updatedPizzagna);

                    // updating preview series if no series set in editor. this occurs when changing DS, for example.
                    // in DS is changing all the series are removed and then all series from DS should be set.
                    // that's why updating preview series.
                    const editorSeriesPath = `${this.formSeriesComponentPath}.series`;
                    const editorSeries = get(
                        this.pizzagnaService.pizzagna,
                        editorSeriesPath
                    );
                    if (isEmpty(editorSeries)) {
                        this.shouldReadForm = false;

                        const seriesForPreview: ITimeseriesWidgetSeries[] =
                            series.map((s: ITimeseriesWidgetData) => ({
                                id: s.id,
                                selectedSeriesId: s.id,
                                label: s.name,
                            }));
                        const updatedPreview = immutableSet(
                            this.getPreview(),
                            `chart.${this.previewSeriesPath}`,
                            seriesForPreview
                        );
                        this.updatePreview(updatedPreview);

                        this.buildForm();

                        setTimeout(() => {
                            this.updateAvailableSeries([]);
                            this.shouldReadForm = true;
                        });
                    }
                }
            }
        );
    }

    public buildForm(): void {
        const preview = this.getPreview();
        const series = get(
            preview,
            `chart.${this.previewSeriesPath}`,
            []
        ) as ITimeseriesWidgetSeries[];
        const seriesToSet = series.map(
            (s) =>
                ({
                    id: s.id,
                    selectedSeriesId: s.selectedSeriesId,
                } as ITimeseriesItemConfiguration)
        );
        const seriesIds = series.map((s) => s.id);

        this.pizzagnaService.createComponentsFromTemplate("series", seriesIds);
        const editorPizzagna = this.pizzagnaService.pizzagna;
        const pizzagnaWithSeries = immutableSet(
            editorPizzagna,
            `${this.formSeriesComponentPath}.series`,
            seriesToSet
        );

        this.updateFormPizzagna(pizzagnaWithSeries);
        this.selectedSeriesIds$.next(
            seriesToSet.map((s) => s.selectedSeriesId)
        );
        setTimeout(() => (this.shouldReadForm = true));
    }

    public toPreview(form: FormGroup): void {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((formSeries) => {
                if (!this.shouldReadForm) {
                    return;
                }
                const preview = this.getPreview();
                const { chart } = preview;
                const seriesFromPreview = get(
                    chart,
                    this.previewSeriesPath,
                    []
                ) as ITimeseriesWidgetSeries[];

                const series: ITimeseriesWidgetSeries[] = formSeries.map(
                    (s: ITimeseriesWidgetSeries) => ({
                        id: s.id,
                        selectedSeriesId: s.selectedSeriesId,
                        ...seriesFromPreview.find(
                            (previewSeries) => previewSeries.id === s.id
                        ),
                    })
                );

                const updatedPreview = immutableSet(
                    preview,
                    `chart.${this.previewSeriesPath}`,
                    series
                );
                this.updatePreview(updatedPreview);

                const selectedSeriesIds = formSeries
                    .map((s: ITimeseriesWidgetSeries) =>
                        get(s, `properties[${s.id}/indicatorData].id`)
                    )
                    .filter((v: any) => !isEmpty(v)) as string[];
                this.selectedSeriesIds$.next(selectedSeriesIds);
            });
    }

    public ngOnDestroy(): void {
        this.dataSourceSeries$.complete();
        this.selectedSeriesIds$.complete();
        super.ngOnDestroy();
    }

    private updateAvailableSeries(availableSeries: ITimeseriesWidgetData[]) {
        if (!this.pizzagnaService.pizzagna) {
            return;
        }

        let updatedPizzagna = this.pizzagnaService.pizzagna;

        // configuration component
        updatedPizzagna = immutableSet(
            updatedPizzagna,
            `${this.formSeriesComponentPath}.availableSeries`,
            availableSeries
        );

        // template
        const seriesTemplate =
            this.pizzagnaService.pizzagna[PizzagnaLayer.Structure][
                this.component.componentId
            ].properties?.template;
        const indicatorDataIndex = seriesTemplate.findIndex(
            (val: ITimeseriesWidgetSeries) => val.id === this.indicatorDataKey
        );
        const indicatorDataPath = `${PizzagnaLayer.Structure}.series.properties.template[${indicatorDataIndex}].properties.availableSeries`;
        updatedPizzagna = immutableSet(
            updatedPizzagna,
            indicatorDataPath,
            availableSeries
        );

        // already created forms
        const seriesIds = get(
            this.pizzagnaService.pizzagna,
            `${PizzagnaLayer.Structure}.series.properties.nodes`
        ) as unknown as string[];
        updatedPizzagna = seriesIds.reduce(
            (res, id) =>
                immutableSet(
                    res,
                    `${PizzagnaLayer.Data}.${id}/${this.indicatorDataKey}.properties.availableSeries`,
                    availableSeries
                ),
            updatedPizzagna
        );

        this.updateFormPizzagna(updatedPizzagna);
    }

    private subscribeToAvailableDataFieldsChange() {
        combineLatest([this.dataSourceSeries$, this.selectedSeriesIds$])
            .pipe(
                takeUntil(this.destroy$),
                map(([dsSeries, usedSeriesIds]) =>
                    dsSeries.filter(
                        (ds) => !usedSeriesIds.find((id) => id === ds.id)
                    )
                ),
                distinctUntilChanged(isEqual)
            )
            .subscribe(this.updateAvailableSeries.bind(this));
    }
}
