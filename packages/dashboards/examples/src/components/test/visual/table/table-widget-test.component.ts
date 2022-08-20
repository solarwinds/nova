import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { ThemeSwitchService } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    IDashboard,
    IWidget,
    ProviderRegistryService,
    WidgetTypesService,
} from "@nova-ui/dashboards";
import keyBy from "lodash/keyBy";

import {
    TestTableDataSource,
    TestTableDataSource2,
} from "../../data/table-datasources";

import { positions, widgets } from "./widgets";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "acme-dashboard",
    templateUrl: "./table-widget-test.component.html",
    styleUrls: ["./table-widget-test.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AcmeDashboardComponent implements OnInit {
    public dashboard: IDashboard = {
        positions: {},
        widgets: {},
    };

    public gridsterConfig = {
        minCols: 12,
        maxCols: 12,
        minRows: 6,
    };

    public editMode = false;

    constructor(
        private providerRegistry: ProviderRegistryService,
        public themeSwitcherService: ThemeSwitchService,
        private widgetTypesService: WidgetTypesService
    ) {
        this.providerRegistry.setProviders({
            [TestTableDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTableDataSource,
                deps: [],
            },
            [TestTableDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTableDataSource2,
                deps: [],
            },
        });
    }

    public ngOnInit(): void {
        const table = this.widgetTypesService.getWidgetType("table");
        if (table?.widget?.structure?.table?.properties) {
            table.widget.structure.table.properties.delayedMousePresenceDetectionEnabled =
                false;
        }

        const widgetsWithStructure = widgets.map((w) => ({
            ...w,
            pizzagna: {
                ...this.widgetTypesService.getWidgetType(w.type, w.version)
                    .widget,
                ...w.pizzagna,
            },
        }));
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        this.dashboard = {
            positions: positions,
            widgets: widgetsIndex,
        };
    }
}
