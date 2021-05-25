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
import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";

import { mapDataToFormatterProperties } from "../../functions/map-data-to-formatter-properties";
import { INTERACTION } from "../../services/types";
import { DATA_SOURCE, IHasChangeDetector, PIZZAGNA_EVENT_BUS, WellKnownDataSourceFeatures } from "../../types";
import { IBroker } from "../providers/types";

import { IKpiConfiguration, IKpiData, IKpiFormatterProperties, IKpiFormattersConfiguration } from "./types";
import { isNil } from "lodash";

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

    public loading = true;

    @HostBinding("class")
    public elementClass = "";

    public formattersProperties: IKpiFormatterProperties;
    public defaultColor: string = "var(--nui-color-bg-secondary)";

    public get interactive(): boolean {
        return (this.configuration?.interactive ||
            this.dataSource?.features?.getFeatureConfig(WellKnownDataSourceFeatures.Interactivity)?.enabled) && !isNil(this.widgetData?.value) || false;
    }

    constructor(public changeDetector: ChangeDetectorRef,
        @Optional() @Inject(DATA_SOURCE) public dataSource: IDataSource,
        @Inject(PIZZAGNA_EVENT_BUS) public eventBus: EventBus<IEvent>) {
    }

    public onInteraction() {
        if (!this.interactive) {
            return;
        }
        this.eventBus.getStream(INTERACTION).next({ payload: { data: this.widgetData } });
    }

    public getScaleBroker(id: string): IBroker | undefined {
        if (this.syncValuesBroker) {
            return this.syncValuesBroker.find(b => b.id === id);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.configuration) {
            const formattersConfiguration: IKpiFormattersConfiguration = changes.configuration.currentValue.formatters;

            if (formattersConfiguration) {
                this.formattersProperties = this.getFormatterProperties(formattersConfiguration);
            }
        }

        if (changes.widgetData) {
            if (this.configuration?.formatters) {
                this.formattersProperties = this.getFormatterProperties(this.configuration.formatters);
            }
        }
    }

    /**
     * Iterates over formatters and maps their properties from the data
     *
     * @param formattersConfiguration
     */
    private getFormatterProperties(formattersConfiguration: IKpiFormattersConfiguration) {
        const formatterKeys = Object.keys(formattersConfiguration);

        const formattersProperties = formatterKeys.reduce((acc: IKpiFormatterProperties, key: string) => {
            const formatterCfg = formattersConfiguration[key]?.formatter;
            if (formatterCfg) {
                acc[key] = { data: mapDataToFormatterProperties(formatterCfg, this.widgetData) };
            }
            return acc;
        }, {});

        return formattersProperties;
    }

}
