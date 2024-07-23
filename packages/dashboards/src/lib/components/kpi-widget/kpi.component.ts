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
    HostBinding,
    Inject,
    Input,
    OnChanges,
    Optional,
    SimpleChanges,
    ViewEncapsulation,
} from "@angular/core";
import _isNil from "lodash/isNil";

import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";

import { mapDataToFormatterProperties } from "../../functions/map-data-to-formatter-properties";
import { INTERACTION } from "../../services/types";
import {
    DATA_SOURCE,
    IHasChangeDetector,
    PIZZAGNA_EVENT_BUS,
    WellKnownDataSourceFeatures,
} from "../../types";
import { IBroker } from "../providers/types";
import {
    IKpiConfiguration,
    IKpiData,
    IKpiFormatterProperties,
    IKpiFormattersConfiguration,
} from "./types";

@Component({
    selector: "nui-kpi",
    templateUrl: "./kpi.component.html",
    styleUrls: ["./kpi.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiComponent implements IHasChangeDetector, OnChanges {
    public static lateLoadKey = "KpiComponent";

    @Input()
    public widgetData: IKpiData;

    @Input()
    public backgroundColor: string;

    @Input()
    public syncValuesBroker: IBroker[];

    @Input()
    public configuration: IKpiConfiguration;

    @Input()
    public busy = false;

    @HostBinding("class")
    public elementClass = "";

    public formattersProperties: IKpiFormatterProperties;
    public defaultColor: string = "var(--nui-color-bg-secondary)";

    public get interactive(): boolean {
        return (
            ((this.configuration?.interactive ||
                this.dataSource?.features?.getFeatureConfig(
                    WellKnownDataSourceFeatures.Interactivity
                )?.enabled) &&
                !_isNil(this.widgetData?.value)) ||
            false
        );
    }

    constructor(
        public changeDetector: ChangeDetectorRef,
        @Optional() @Inject(DATA_SOURCE) public dataSource: IDataSource,
        @Inject(PIZZAGNA_EVENT_BUS) public eventBus: EventBus<IEvent>
    ) {}

    public onInteraction(): void {
        if (!this.interactive) {
            return;
        }
        this.eventBus
            .getStream(INTERACTION)
            .next({ payload: { data: this.widgetData } });
    }

    public getScaleBroker(id: string): IBroker | undefined {
        if (this.syncValuesBroker) {
            return this.syncValuesBroker.find((b) => b.id === id);
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.configuration) {
            const formattersConfiguration: IKpiFormattersConfiguration =
                changes.configuration.currentValue.formatters;

            if (formattersConfiguration) {
                this.formattersProperties = this.getFormatterProperties(
                    formattersConfiguration
                );
            }
        }

        if (changes.widgetData) {
            if (this.configuration?.formatters) {
                this.formattersProperties = this.getFormatterProperties(
                    this.configuration.formatters
                );
            }
        }
    }

    public get isEmpty(): boolean {
        console.log(this.widgetData);
        return !this.widgetData?.value;
    }

    /**
     * Iterates over formatters and maps their properties from the data
     *
     * @param formattersConfiguration
     */
    private getFormatterProperties(
        formattersConfiguration: IKpiFormattersConfiguration
    ) {
        const formatterKeys = Object.keys(formattersConfiguration);

        const formattersProperties = formatterKeys.reduce(
            (acc: IKpiFormatterProperties, key: string) => {
                const formatterCfg = formattersConfiguration[key]?.formatter;
                if (formatterCfg) {
                    acc[key] = {
                        data: mapDataToFormatterProperties(
                            formatterCfg,
                            this.widgetData
                        ),
                    };
                }
                return acc;
            },
            {}
        );

        return formattersProperties;
    }
}
