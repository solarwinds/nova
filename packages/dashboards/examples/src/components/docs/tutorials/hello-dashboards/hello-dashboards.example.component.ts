import { Component, OnInit } from "@angular/core";
import {
    IDashboard,
    IWidget,
    IWidgets,
    KpiComponent,
    PizzagnaLayer,
    WidgetTypesService,
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "hello-dashboards-example",
    templateUrl: "./hello-dashboards.example.component.html",
    styleUrls: ["./hello-dashboards.example.component.less"],
})
export class HelloDashboardsExampleComponent implements OnInit {
    // This variable will have all the data needed to render the widgets widgets.
    // Pass this to the dashboard component's dashboard input.
    public dashboard: IDashboard;
    // Angular gridster requires a configuration object even if its empty.
    // Pass this to the dashboard component's gridsterConfig input.
    public gridsterConfig: GridsterConfig = {};

    // WidgetTypesService provides the widget's necessary structure information
    constructor(private widgetTypesService: WidgetTypesService) {}

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
