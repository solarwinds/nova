import { Inject } from "@angular/core";
import { EventBus, IDataSourceDrilldown, IEvent, IFilteringOutputs } from "@solarwinds/nova-bits";
import { takeUntil } from "rxjs/operators";

import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { DRILLDOWN, REFRESH } from "../../services/types";
import { DATA_SOURCE, IProperties, PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../types";

import { DataSourceAdapter } from "./data-source-adapter";
import { IDrilldownComponentsConfiguration } from "./types";

export class DrilldownDataSourceAdapter extends DataSourceAdapter {

    protected dataPath: string;
    protected navigationBarId: string;
    protected drillstate: string[] = [];
    protected groupBy: string[];
    protected componentsConfig: IDrilldownComponentsConfiguration;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                @Inject(DATA_SOURCE) public dataSource: IDataSourceDrilldown,
                pizzagnaService: PizzagnaService) {
        super(eventBus, dataSource, pizzagnaService);

        this.eventBus.getStream(DRILLDOWN)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IEvent) => {
                if (this.dataSource.busy?.value ) { return; }
                this.onDrilldown(event);
            });

        this.registerFilters();
    }

    protected updateAdapterProperties(properties: IProperties) {
        this.dataPath = properties.dataPath;
        this.drillstate = properties.drillstate || this.drillstate;
        this.groupBy = properties.groupBy;
        this.componentsConfig = properties.componentsConfig;
        this.navigationBarId = properties.navigationBarId;
    }

    protected updateOutput(output: IFilteringOutputs | undefined) {
        const widgetInput = this.getWidgetInput(output, this.drillstate.length !== this.groupBy.length);
        const widgetPath = `${PizzagnaLayer.Data}.${this.componentId}.properties`;
        this.pizzagnaService.setProperty(widgetPath, widgetInput);

        // update navBar label
        if (this.navigationBarId) {
            const navBarPath = `${PizzagnaLayer.Data}.${this.navigationBarId}.properties.navBarConfig.label`;
            const navBarIsRootPath = `${PizzagnaLayer.Data}.${this.navigationBarId}.properties.navBarConfig.isRoot`;
            const navBarBackPath = `${PizzagnaLayer.Data}.${this.navigationBarId}.properties.navBarConfig.buttons.back.disabled`;
            this.pizzagnaService.setProperty(navBarPath, this.drillstate[this.drillstate.length - 1]);
            this.pizzagnaService.setProperty(navBarBackPath, !!this.drillstate.length);
            this.pizzagnaService.setProperty(navBarIsRootPath, !this.drillstate.length);
        }
    }

    protected getWidgetInput(data: any, group: boolean) {
        const configuration = this.componentsConfig[group ? "group" : "leaf"];

        return {
            [this.dataPath]: data,
            configuration,
        };
    }

    protected onDrilldown(event: IEvent) {
        const { payload } = event;

        if (payload.reset) {
            this.drillstate = [];
            this.eventBus.next(REFRESH);
            return;
        }

        if (payload.back) {
            this.drillstate.length = this.drillstate.length - 1;
            this.eventBus.next(REFRESH);
            return;
        }

        this.drillstate.push(payload.id);
        this.eventBus.next(REFRESH);
    }

    private registerFilters() {
        this.dataSource.registerComponent({
            group: {
                componentInstance: {
                    getFilters: () => ({
                        // type: "group",
                        value: this.groupBy,
                    }),
                },
            },
            drillstate: {
                componentInstance: {
                    getFilters: () => ({
                        // type: "drillstate",
                        value: this.drillstate,
                    }),
                },
            },
        });
    }
}
