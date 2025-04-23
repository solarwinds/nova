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

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, Injectable, OnDestroy, OnInit } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

import { DataSourceService, IFilteringOutputs } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IDashboard,
    IRiskScoreData,
    IProviderConfiguration,
    IRefresherProperties,
    IWidget,
    IWidgets,
    RiskScoreTileComponent,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class AverageRatingRiskScoreDataSource
    extends DataSourceService<IRiskScoreData>
    implements OnDestroy
{
    // This is the ID we'll use to identify the provider
    public static providerId = "AverageRatingRiskScoreDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    // In this example, getFilteredData is invoked every 10 minutes (Take a look at the refresher
    // provider definition in the widget configuration below to see how the interval is set)
    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            // *** Make a resource request to an external API (if needed)
            this.http
                .get("https://www.googleapis.com/books/v1/volumes/5MQFrgEACAAJ")
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.volumeInfo.averageRating,
                            },
                        });
                    },
                    error: (error: HttpErrorResponse) => {
                        resolve({
                            result: null,
                            error: {
                                type: error.status,
                            },
                        });
                    },
                });
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
    selector: "risk-score-widget-example",
    templateUrl: "./risk-score-widget-example.component.html",
    styleUrls: ["./risk-score-widget-example.component.less"],
    standalone: false,
})
export class RiskScoreWidgetExampleComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    // Boolean passed as an input to the dashboard. When true, widgets can be moved, resized, removed, or edited
    public editMode: boolean = false;

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,

        // In general, the ProviderRegistryService is used for making entities available for injection into dynamically loaded components.
        private providerRegistry: ProviderRegistryService
    ) {}

    public ngOnInit(): void {
        // Grabbing the widget's default template which will be needed as a parameter for setNode
        const widgetTemplate = this.widgetTypesService.getWidgetType(
            "risk-score",
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
            [AverageRatingRiskScoreDataSource.providerId]
        );

        // Registering the data source for injection into the KPI tile.
        // Note: Each tile of a KPI widget is assigned its own instance of the data source
        this.providerRegistry.setProviders({
            [AverageRatingRiskScoreDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AverageRatingRiskScoreDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [HttpClient],
            },
        });

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const riskScoreWidget = widgetConfig;
        const widgetIndex: IWidgets = {
            // Complete the KPI widget with information coming from its type definition
            [riskScoreWidget.id]:
                this.widgetTypesService.mergeWithWidgetType(riskScoreWidget),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [riskScoreWidget.id]: {
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

const widgetConfig: IWidget = {
    id: "riskScoreWidgetId",
    type: "risk-score",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.Refresher]: {
                        properties: {
                            // Configuring the refresher interval so that our data source is invoked every ten minutes
                            interval: 60 * 10,
                            enabled: true,
                        } as IRefresherProperties,
                    } as Partial<IProviderConfiguration>,
                },
            },
            header: {
                properties: {
                    title: "Harry Potter and the Sorcerer's Stone",
                    subtitle: "By J. K. Rowling",
                },
            },
            tiles: {
                properties: {
                    nodes: ["riskScore1"],
                },
            },
            riskScore1: {
                id: "riskScore1",
                componentType: RiskScoreTileComponent.lateLoadKey,
                properties: {
                    widgetData: {
                        minValue: 0,
                        maxValue: 5,
                        useStaticLabel: false,
                        staticLabel: undefined,
                        label: `Average Rating`,
                        description: `Harry Potter and the Sorcerer's Stone By J. K. Rowling Average Rating Risk Score`,
                    },
                },
                providers: {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        providerId: AverageRatingRiskScoreDataSource.providerId,
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        providerId: NOVA_KPI_DATASOURCE_ADAPTER,
                        properties: {
                            componentId: "riskScore1",
                            propertyPath: "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
        },
    },
};
