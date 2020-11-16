import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Inject, Input, Optional, ViewEncapsulation } from "@angular/core";
import { EventBus, IDataSource, IEvent } from "@solarwinds/nova-bits";

import { INTERACTION } from "../../services/types";
import { DATA_SOURCE, IHasChangeDetector, PIZZAGNA_EVENT_BUS, WellKnownDataSourceFeatures } from "../../types";

import { IKpiConfiguration, IKpiData } from "./types";

@Component({
    selector: "nui-kpi",
    templateUrl: "./kpi.component.html",
    styleUrls: ["./kpi.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiComponent implements IHasChangeDetector {
    public static lateLoadKey = "KpiComponent";

    @Input()
    public widgetData: IKpiData;

    @Input()
    public configuration: IKpiConfiguration;

    @Input()
    public busy = false;

    @HostBinding("class")
    public elementClass = "";

    public get interactive() {
        return this.configuration?.interactive ||
            this.dataSource?.features?.getFeatureConfig(WellKnownDataSourceFeatures.Interactivity)?.enabled;
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

}
