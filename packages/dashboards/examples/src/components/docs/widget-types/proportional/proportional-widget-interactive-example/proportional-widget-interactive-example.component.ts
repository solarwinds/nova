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
    ChangeDetectorRef,
    Component,
    Injectable,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import keyBy from "lodash/keyBy";
import { BehaviorSubject } from "rxjs";

import {
    DataSourceService,
    IDataSource,
    IFilteringOutputs,
} from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IDashboard,
    IProportionalWidgetChartOptions,
    IProportionalWidgetConfig,
    IProportionalWidgetData,
    IProviderConfiguration,
    IRefresherProperties,
    IWidget,
    IWidgets,
    LegendPlacement,
    NOVA_URL_INTERACTION_HANDLER,
    PizzagnaLayer,
    ProportionalWidgetChartTypes,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";

/**
 * A simple proportional data source to retrieve beer review counts by city
 */
@Injectable()
export class ReviewCountsByCityMockDataSource
    extends DataSourceService<IProportionalWidgetData>
    implements IDataSource<IProportionalWidgetData>, OnDestroy
{
    // This is the ID we'll use to identify the provider
    public static providerId = "ReviewCountsByCityMockDataSource";
    public busy = new BehaviorSubject(false);

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                this.outputsSubject.next({
                    result: getMockBeerReviewCountsByCity(),
                });
                this.busy.next(false);
            }, 300);
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "proportional-widget-interactive-example",
    templateUrl: "./proportional-widget-interactive-example.component.html",
    styleUrls: ["./proportional-widget-interactive-example.component.less"],
})
export class ProportionalWidgetInteractiveExampleComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard | undefined;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    // Boolean passed as an input to the dashboard. When true, widgets can be moved, resized, removed, or edited
    public editMode: boolean = false;

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,
        // In general, the ProviderRegistryService is used for making entities available for injection into dynamically loaded components.
        private providerRegistry: ProviderRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        // Grabbing the widget's default template which will be needed as a parameter for setNode
        const widgetTemplate = this.widgetTypesService.getWidgetType(
            "proportional",
            1
        );

        // Registering our data sources as dropdown options in the widget editor/configurator
        // Note: This could also be done in the parent module's constructor so that
        // multiple dashboards could have access to the same widget template modification.
        this.widgetTypesService.setNode(
            // This is the template we grabbed above with getWidgetType
            widgetTemplate,
            // We are setting the editor/configurator part of the widget template
            "configurator",
            // This indicates which node you are changing and we want to change
            // the data source providers available for selection in the editor.
            WellKnownPathKey.DataSourceProviders,
            // We are setting the data sources available for selection in the editor
            [ReviewCountsByCityMockDataSource.providerId]
        );

        // Registering the data source for injection into the Proportional widget.
        this.providerRegistry.setProviders({
            [ReviewCountsByCityMockDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: ReviewCountsByCityMockDataSource,
                deps: [],
            },
        });

        this.initializeDashboard();
    }

    /** Used for restoring widgets state */
    public reInitializeDashboard() {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const widgetsWithStructure = widgetConfigs.map((w) =>
            this.widgetTypesService.mergeWithWidgetType(w)
        );
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [widgetConfigs[0].id]: {
                cols: 6,
                rows: 6,
                y: 0,
                x: 0,
            },
            [widgetConfigs[1].id]: {
                cols: 6,
                rows: 6,
                y: 0,
                x: 6,
            },
        };

        // Finally, assigning the variables we created above to the dashboard
        this.dashboard = {
            positions,
            widgets: widgetsIndex,
        };
    }
}

const widgetConfigs: IWidget[] = [
    {
        id: "widget1",
        type: "proportional",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        // Configuring the UrlInteractionHandler to handle interactions
                        [WellKnownProviders.InteractionHandler]: {
                            providerId: NOVA_URL_INTERACTION_HANDLER,
                            properties: {
                                // the 'url' property tells the handler what link to use when interaction occurs on the series
                                // if the series does not have a link we are passing one to the handler
                                url: "${data.link || 'https://en.wikipedia.org/wiki/'+data.id}",
                                // by default the link is opened in the current window, set 'newWindow' to true to open in a new tab instead
                                // newWindow: true,
                            },
                        },
                    },
                },
                header: {
                    properties: {
                        title: "Proportional Widget",
                        subtitle: "With interaction handler",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            // Setting the data source providerId for the chart
                            providerId:
                                ReviewCountsByCityMockDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            // Setting the interactive to true
                            interactive: true,
                            chartOptions: {
                                type: ProportionalWidgetChartTypes.VerticalBarChart,
                                legendPlacement: LegendPlacement.Bottom,
                            } as IProportionalWidgetChartOptions,
                            prioritizeWidgetColors: false,
                        } as IProportionalWidgetConfig,
                    },
                },
            },
        },
    },
    {
        id: "widget2",
        type: "proportional",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                header: {
                    properties: {
                        title: "Proportional Widget",
                        subtitle: "Without interaction handler",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            // Setting the data source providerId for the chart
                            providerId:
                                ReviewCountsByCityMockDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            // interactive set to false so series without links are not styled like a link
                            interactive: false,
                            chartOptions: {
                                type: ProportionalWidgetChartTypes.HorizontalBarChart,
                                legendPlacement: LegendPlacement.Bottom,
                            } as IProportionalWidgetChartOptions,
                            prioritizeWidgetColors: false,
                        } as IProportionalWidgetConfig,
                    },
                },
            },
        },
    },
];

export function getMockBeerReviewCountsByCity() {
    return [
        {
            id: "Brno",
            name: "Brno",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_down",
            link: "https://en.wikipedia.org/wiki/Brno",
            value: "Brno",
            color: "var(--nui-color-chart-one)",
        },
        {
            id: "kyiv",
            name: "Kyiv",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_critical",
            link: "https://en.wikipedia.org/wiki/Kyiv",
            value: "Kyiv",
            color: "var(--nui-color-chart-two)",
        },
        {
            id: "austin",
            name: "Austin",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_warning",
            value: "Austin",
            color: "var(--nui-color-chart-three)",
        },
        {
            id: "lisbon",
            name: "Lisbon",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_unknown",
            link: "https://en.wikipedia.org/wiki/Lisbon",
            value: "Lisbon",
            color: "var(--nui-color-chart-four)",
        },
        {
            id: "sydney",
            name: "Sydney",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_up",
            value: "Sydney",
            color: "var(--nui-color-chart-five)",
        },
        {
            id: "nur-sultan",
            name: "Nur-Sultan",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_unmanaged",
            value: "Nur-Sultan",
            color: "var(--nui-color-chart-six)",
        },
    ].sort((a, b) => a.data[0] - b.data[0]);
}
