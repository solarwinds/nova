import { IChartMarker, IValueProvider } from "../../core/common/types";

import { AreaAccessors, IAreaAccessors } from "./area-accessors";

export function stackedAreaAccessors(
    colorProvider?: IValueProvider<string>,
    markerProvider?: IValueProvider<IChartMarker>
): IAreaAccessors {
    const areaAccessors = new AreaAccessors(colorProvider, markerProvider);

    areaAccessors.data.x = (d) => d.x;
    areaAccessors.data.y = areaAccessors.data.absoluteY1;
    areaAccessors.data.y0 = () => 0;
    areaAccessors.data.y1 = (d) => d.y;

    return areaAccessors;
}
