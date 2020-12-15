import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiBusyModule, NuiButtonModule, NuiDocsModule, NuiIconModule, NuiMessageModule, NuiSwitchModule } from "@nova-ui/bits";
import { IFormatterDefinition, LinkFormatterComponent, NuiDashboardsModule, WellKnownPathKey, WidgetTypesService } from "@nova-ui/dashboards";

import { HeroDashboardComponent } from "./hero/dashboard/hero-dashboard.component";
import { HarryPotterAverageRatingDataSource, HarryPotterRatingsCountDataSource } from "./hero/data/kpi-datasources";
import { BeerReviewCountsByCityMockDataSource, BeerReviewCountsByCityMockDataSource2 } from "./hero/data/proportional-datasources";
import { BeerDataSource } from "./hero/data/table/beer-data-source";
import { RandomUserDataSource } from "./hero/data/table/random-user-data-source";
import { BeerVsReadingMockDataSource, LoungingVsFrisbeeGolfMockDataSource } from "./hero/data/timeseries-data-sources";
import { OverviewDocsComponent } from "./overview-docs.component";

const routes = [
    {
        path: "",
        component: OverviewDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "hero",
        component: HeroDashboardComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        CommonModule,
        NuiDashboardsModule,
        NuiBusyModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiSwitchModule,
        NuiIconModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        OverviewDocsComponent,
        HeroDashboardComponent,
    ],
})
export class OverviewModule {
    constructor(private widgetTypesService: WidgetTypesService) {
        this.setupDataSourceProviders();
        this.setupProportionalLegendFormatters();
    }

    private setupDataSourceProviders() {
        this.setDataSourceProviders("table", [RandomUserDataSource.providerId, BeerDataSource.providerId]);
        this.setDataSourceProviders("kpi", [HarryPotterAverageRatingDataSource.providerId, HarryPotterRatingsCountDataSource.providerId]);
        this.setDataSourceProviders("proportional", [BeerReviewCountsByCityMockDataSource.providerId, BeerReviewCountsByCityMockDataSource2.providerId]);
        this.setDataSourceProviders("timeseries", [BeerVsReadingMockDataSource.providerId, LoungingVsFrisbeeGolfMockDataSource.providerId]);
    }

    private setDataSourceProviders(type: string, providers: string[]) {
        const widgetTemplate = this.widgetTypesService.getWidgetType(type, 1);
        this.widgetTypesService.setNode(widgetTemplate, "configurator", WellKnownPathKey.DataSourceProviders, providers);
    }

    private setupProportionalLegendFormatters() {
        const formatters: IFormatterDefinition[] = [
            {
                componentType: LinkFormatterComponent.lateLoadKey,
                "label": $localize`Link`,
                dataTypes: {
                    value: "label",
                    link: "link",
                },
            },
        ];

        const widgetTemplate = this.widgetTypesService.getWidgetType("proportional", 1);
        this.widgetTypesService.setNode(widgetTemplate, "configurator", WellKnownPathKey.Formatters, formatters);
    }
}
