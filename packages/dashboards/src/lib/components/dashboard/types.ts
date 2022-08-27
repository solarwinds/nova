import { GridsterItem } from "angular-gridster2";

import {
    WidgetUpdateOperation,
    WidgetRemovalOperation,
} from "../../configurator/services/types";
import { IWidgets } from "../widget/types";

export interface IDashboard {
    widgets: IWidgets;
    positions: Record<string, GridsterItem>;
}

export interface IDashboardBelowFoldLazyLoadingConfig {
    enabled: boolean;
    configuration?: {
        // reloads widgets if they were already loaded but then disappeared from the view
        reloadWidgetsOnScroll: boolean;
    };
}

export interface IDashboardPersistenceHandler {
    trySubmit?: WidgetUpdateOperation;
    tryRemove?: WidgetRemovalOperation;
}
