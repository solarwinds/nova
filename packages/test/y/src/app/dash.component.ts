import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {
    IDashboard, IWidget, IWidgets, KpiComponent,
    NuiDashboardsModule, PizzagnaLayer,
    WidgetTypesService
} from "@nova-ui/dashboards";
import {GridsterConfig, GridsterItem} from "angular-gridster2";
import {AppModule} from "./dash.module";

@Component({
    selector: 'app-dash',
    styleUrls: ['./dash.component.scss'],
    template: `
        <div class="w-100 dashboard">
            <!--
                Note: The dashboard and gridsterConfig input assignments must use banana-in-a-box notation to keep
                the dashboard state updated with changes to the pizzagna.
            -->
            <nui-dashboard
                *ngIf="dashboard"
                [(dashboard)]="dashboard"
                [(gridsterConfig)]="gridsterConfig"
            >
            </nui-dashboard>

        </div>
    `,
    styles: [],
})
export class DashComponent {
    title = 'y';
    // This variable will have all the data needed to render the widgets widgets.
    // Pass this to the dashboard component's dashboard input.
    public dashboard: IDashboard = {positions: {}, widgets: {}};
    // Angular gridster requires a configuration object even if its empty.
    // Pass this to the dashboard component's gridsterConfig input.
    public gridsterConfig: GridsterConfig = {};

    // WidgetTypesService provides the widget's necessary structure information
    constructor(private widgetTypesService: WidgetTypesService) {
    }

    public ngOnInit(): void {
        // Here we are hard-coding the widget config for this example, but this is where you
        // could potentially populate the widget's configuration from a database
        const kpiWidget = widgetConfig;
        const widgetIndex: IWidgets = {
            // Complete the KPI widget with information coming from its type definition
            [kpiWidget.id]:
                this.widgetTypesService.mergeWithWidgetType(kpiWidget),
        };
        // Setting widget position and dimensions (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [kpiWidget.id]: {
                cols: 4,
                rows: 6,
                y: 0,
                x: 0,
            },
        };
        // Finally, assigning the variables we created above to the dashboard
        this.dashboard = {
            positions,
            widgets: widgetIndex,
        };
    }
}

// In a real-world scenario, this configuration would typically be fetched from a database or at least live in another file
const widgetConfig: IWidget = {
    id: "widget1",
    type: "kpi",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            header: {
                properties: {
                    title: "Hello, KPI Widget!",
                    subtitle: "A Venue for Meaningful Values",
                },
            },
            tiles: {
                properties: {
                    nodes: ["kpi1"],
                },
            },
            kpi1: {
                id: "kpi1",
                componentType: KpiComponent.lateLoadKey,
                properties: {
                    widgetData: {
                        id: "totalStorage",
                        value: 1,
                        label: "Total storage",
                        units: "TB",
                    },
                },
            },
        },
    },
};
