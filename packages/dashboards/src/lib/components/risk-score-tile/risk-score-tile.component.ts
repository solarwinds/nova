// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
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
    IRiskScoreConfiguration,
    IRiskScoreData,
    IRiskScoreFormatterProperties,
    IRiskScoreFormattersConfiguration,
} from "./types";

@Component({
    selector: "nui-risk-score-tile",
    templateUrl: "./risk-score-tile.component.html",
    styleUrls: ["./risk-score-tile.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskScoreTileComponent implements IHasChangeDetector, OnChanges {
    public static lateLoadKey = "RiskScoreTileComponent";

    @Input()
    public widgetData: IRiskScoreData;

    @Input()
    public backgroundColor: string;

    @Input()
    public syncValuesBroker: IBroker[];

    @Input()
    public configuration: IRiskScoreConfiguration;

    @Input()
    public busy = false;

    @HostBinding("class")
    public elementClass = "";

    public formattersProperties: IRiskScoreFormatterProperties;
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

    public onInteraction() {
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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.configuration) {
            const formattersConfiguration: IRiskScoreFormattersConfiguration =
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

    /**
     * Iterates over formatters and maps their properties from the data
     *
     * @param formattersConfiguration
     */
    private getFormatterProperties(
        formattersConfiguration: IRiskScoreFormattersConfiguration
    ) {
        const formatterKeys = Object.keys(formattersConfiguration);

        const formattersProperties = formatterKeys.reduce(
            (acc: IRiskScoreFormatterProperties, key: string) => {
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
