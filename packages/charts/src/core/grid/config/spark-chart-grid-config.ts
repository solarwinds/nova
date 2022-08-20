import { BorderConfig } from "./border-config";
import { XYGridConfig } from "./xy-grid-config";

/**
 * Applies spark chart specific grid configuration
 *
 * @param c
 * @param showBottomAxis
 * @param showTopBorder
 */
export function sparkChartGridConfig(
    c: XYGridConfig = new XYGridConfig(),
    showBottomAxis: boolean = false,
    showTopBorder: boolean = true
): XYGridConfig {
    c.interactionPlugins = false;

    c.axis.left.visible = false;
    c.axis.left.gridTicks = false;
    c.dimension.margin.left = 5;
    c.dimension.margin.right = 5;
    c.dimension.margin.bottom = showBottomAxis ? c.dimension.margin.bottom : 0;
    c.dimension.padding.top = 5;
    c.dimension.padding.bottom = 5;
    c.dimension.autoHeight = false;

    // TODO: avoid magic number
    // Hard-coded value stands for the height of rich legend tile when there are 2 rows of description.
    // We need to figure out how to make a better layout that will not require magic numbers.
    c.dimension.height(36);

    if (showTopBorder) {
        c.borders.top = new BorderConfig();
    }
    if (!showBottomAxis) {
        c.borders.bottom.visible = false;
    }

    return c;
}
