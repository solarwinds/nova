import { HttpClient } from "@angular/common/http";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import keyBy from "lodash/keyBy";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

import { immutableSet } from "@nova-ui/bits";
import {
    DashboardComponent,
    DATA_SOURCE,
    IDashboard,
    IDashboardBelowFoldLazyLoadingConfig,
    IWidget,
    IWidgetSelector,
    PizzagnaLayer,
    ProviderRegistryService,
    RefresherSettingsService,
    WidgetClonerService,
    WidgetTypesService,
    WIDGET_CREATE,
} from "@nova-ui/dashboards";

import { AcmeCloneSelectionComponent } from "./acme-clone-selection/acme-clone-selection.component";
import { AcmeEditWithClonerComponent } from "./acme-clone-selection/acme-edit-with-cloner.component";
import { AcmeFormSubmitHandler } from "./acme-form-submit-handler";
import { AcmeKpiDataSource } from "./datasources";
import { positions, widgets } from "./widgets";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "many-widgets-dashboard-dashboard",
    templateUrl: "./many-widgets.component.html",
    styleUrls: ["./many-widgets.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [AcmeFormSubmitHandler],
})
export class ManyWidgetsDashboardComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(DashboardComponent, { static: true })
    dashboardComponent: DashboardComponent;

    public dashboard: IDashboard = {
        positions: {},
        widgets: {},
    };

    public gridsterConfig = {
        minCols: 12,
        maxCols: 12,
        minRows: 12,
    };

    public editMode = false;
    public systemRefreshInterval: number = 60;

    public belowFoldLazyLoadingConfig: IDashboardBelowFoldLazyLoadingConfig = {
        enabled: true,
    };

    private destroy$ = new Subject();

    constructor(
        private providerRegistry: ProviderRegistryService,
        public submitHandler: AcmeFormSubmitHandler,
        private widgetTypesService: WidgetTypesService,
        private widgetClonerService: WidgetClonerService,
        private refreshSettings: RefresherSettingsService
    ) {
        this.providerRegistry.setProviders({
            [AcmeKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeKpiDataSource,
                deps: [HttpClient],
            },
        });
    }

    public ngOnInit(): void {
        this.widgetTypesService
            .getWidgetType("table")
            .configurator?.[
                PizzagnaLayer.Structure
            ].presentation.properties?.nodes.push("refresher");

        this.refreshSettings.refreshRateSeconds = this.systemRefreshInterval;

        const widgetsWithStructure = widgets.map((w) =>
            this.widgetTypesService.mergeWithWidgetType(w)
        );
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        this.dashboard = {
            positions: positions,
            widgets: widgetsIndex,
        };
    }

    public onDsErrorSwitch(value: boolean) {
        AcmeKpiDataSource.mockError = value;
    }

    public onShowButtonSwitch(value: boolean, property: string) {
        for (const widget of Object.keys(this.dashboard.widgets)) {
            this.dashboard = immutableSet(
                this.dashboard,
                `widgets.${widget}.pizzagna.configuration.header.properties.${property}`,
                value
            );
        }
    }

    public ngAfterViewInit(): void {
        this.dashboardComponent.eventBus.subscribeUntil(
            WIDGET_CREATE,
            this.destroy$,
            (event) => {
                const cloner: IWidgetSelector = {
                    // @ts-ignore: Suppressing strict mode error, preserving old flow
                    widget: this.dashboard.widgets[event.widgetId],
                    dashboardComponent: this.dashboardComponent,
                    trySubmit: this.submitHandler.trySubmit,
                    widgetSelectionComponentType: AcmeEditWithClonerComponent,
                };
                this.widgetClonerService
                    .open(cloner)
                    .pipe(take(1), takeUntil(this.destroy$))
                    .subscribe();
            }
        );
    }

    public onCloneWidget() {
        const cloner: IWidgetSelector = {
            dashboardComponent: this.dashboardComponent,
            trySubmit: this.submitHandler.trySubmit,
            widgetSelectionComponentType: AcmeCloneSelectionComponent,
        };
        this.widgetClonerService
            .open(cloner)
            .pipe(take(1), takeUntil(this.destroy$))
            .subscribe();
    }

    public onEditWithCloner() {
        // this simulates invoking WIDGET_CREATE event from inside of the first widget
        this.dashboardComponent.eventBus.next(WIDGET_CREATE, {
            widgetId: widgets[0].id,
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onSystemRefreshIntervalClick() {
        this.refreshSettings.refreshRateSeconds = this.systemRefreshInterval;
    }
}
