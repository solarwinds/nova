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

import { Inject } from "@angular/core";
import { takeUntil } from "rxjs/operators";

import {
    EventBus,
    IDataSourceDrilldown,
    IEvent,
    IFilteringOutputs,
} from "@nova-ui/bits";

import { DataSourceAdapter } from "./data-source-adapter";
import {
    IDrilldownComponentConfiguration,
    IDrilldownComponentsConfiguration,
} from "./types";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { DRILLDOWN, REFRESH } from "../../services/types";
import {
    DATA_SOURCE,
    IProperties,
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
} from "../../types";

export class DrilldownDataSourceAdapter extends DataSourceAdapter {
    protected dataPath: string;
    protected navigationBarId: string;
    protected drillstate: string[] = [];
    protected groupBy: string[];
    protected componentsConfig: IDrilldownComponentsConfiguration;

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        @Inject(DATA_SOURCE) public dataSource: IDataSourceDrilldown,
        pizzagnaService: PizzagnaService
    ) {
        super(eventBus, dataSource, pizzagnaService);

        this.eventBus
            .getStream(DRILLDOWN)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IEvent) => {
                if (this.dataSource.busy?.value) {
                    return;
                }
                this.onDrilldown(event);
            });

        this.registerFilters();
    }

    protected updateAdapterProperties(properties: IProperties): void {
        this.dataPath = properties.dataPath;
        this.drillstate = properties.drillstate || this.drillstate;
        this.groupBy = properties.groupBy;
        this.componentsConfig = properties.componentsConfig;
        this.navigationBarId = properties.navigationBarId;
    }

    protected updateOutput(output: IFilteringOutputs | undefined): void {
        const widgetInput = this.getWidgetInput(
            output,
            this.drillstate.length !== this.groupBy.length
        );
        const widgetPath = `${PizzagnaLayer.Data}.${this.componentId}.properties`;
        this.pizzagnaService.setProperty(widgetPath, widgetInput);

        // update navBar label
        if (this.navigationBarId) {
            const navBarPath = `${PizzagnaLayer.Data}.${this.navigationBarId}.properties.navBarConfig.label`;
            const navBarIsRootPath = `${PizzagnaLayer.Data}.${this.navigationBarId}.properties.navBarConfig.isRoot`;
            const navBarBackPath = `${PizzagnaLayer.Data}.${this.navigationBarId}.properties.navBarConfig.buttons.back.disabled`;
            this.pizzagnaService.setProperty(
                navBarPath,
                this.drillstate[this.drillstate.length - 1]
            );
            this.pizzagnaService.setProperty(
                navBarBackPath,
                !!this.drillstate.length
            );
            this.pizzagnaService.setProperty(
                navBarIsRootPath,
                !this.drillstate.length
            );
        }
    }

    protected getWidgetInput(
        data: any,
        group: boolean
    ): Record<string, any> & {
        configuration: IDrilldownComponentConfiguration;
    } {
        const configuration = this.componentsConfig[group ? "group" : "leaf"];

        return {
            [this.dataPath]: data,
            configuration,
        };
    }

    protected onDrilldown(event: IEvent): void {
        const { payload } = event;

        if (payload.reset) {
            this.drillstate = [];
            this.eventBus.next(REFRESH, {});
            return;
        }

        if (payload.back) {
            this.drillstate.length = this.drillstate.length - 1;
            this.eventBus.next(REFRESH, {});
            return;
        }

        this.drillstate.push(payload.id);
        this.eventBus.next(REFRESH, {});
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
