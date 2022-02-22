import { GridsterItem } from "angular-gridster2";
import { IWidgets } from "../widget/types";
import { WidgetUpdateOperation, WidgetRemovalOperation } from "../../configurator/services/types"

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
