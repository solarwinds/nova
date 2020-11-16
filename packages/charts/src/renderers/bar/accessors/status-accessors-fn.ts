import { IChartMarker, IValueProvider } from "../../../core/common/types";

import { HorizontalBarAccessors } from "./horizontal-bar-accessors";
import { StatusAccessors } from "./status-accessors";

export function statusAccessors(colorProvider: IValueProvider<string>, markerProvider?: IValueProvider<IChartMarker>): StatusAccessors {
    const accessors = new StatusAccessors(new HorizontalBarAccessors(colorProvider, markerProvider));
    accessors.data.color = (d, i, s, ds) => colorProvider.get(accessors.data.status(d, i, s, ds));
    accessors.data.category = () => StatusAccessors.STATUS_CATEGORY;
    return accessors;
}
