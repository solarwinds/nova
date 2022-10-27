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

import { OverlayModule } from "@angular/cdk/overlay";
import { NgModule } from "@angular/core";
// This is not technically used here, but it does pull in the type for $localize
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LocalizeFn } from "@angular/localize/init";
import "d3-selection-multi";

import {
    NuiCommonModule,
    NuiIconModule,
    NuiPopoverModule,
} from "@nova-ui/bits";

import { ChartCollectionIdDirective } from "./chart-collection/chart-collection-id.directive";
import { ChartCollectionService } from "./chart-collection/chart-collection.service";
import { ChartDonutContentComponent } from "./chart-donut-content/chart-donut-content.component";
import { ChartMarkerComponent } from "./chart-marker/chart-marker.component";
import { ChartPopoverComponent } from "./chart-popover/chart-popover.component";
import { ChartTooltipComponent } from "./chart-tooltips/chart-tooltip.component";
import { ChartTooltipDirective } from "./chart-tooltips/chart-tooltip.directive";
import { ChartTooltipsComponent } from "./chart-tooltips/chart-tooltips.component";
import { ChartComponent } from "./chart/chart.component";
import { LegendSeriesComponent } from "./legend/legend-series/legend-series.component";
import { BasicLegendTileComponent } from "./legend/legend-tile/basic-legend-tile/basic-legend-tile.component";
import { RichLegendTileComponent } from "./legend/legend-tile/rich-legend-tile/rich-legend-tile.component";
import { LegendComponent } from "./legend/legend.component";
import { ThresholdsService } from "./thresholds/thresholds-service";

@NgModule({
    imports: [NuiCommonModule, NuiIconModule, NuiPopoverModule, OverlayModule],
    declarations: [
        LegendComponent,
        LegendSeriesComponent,
        BasicLegendTileComponent,
        RichLegendTileComponent,
        ChartComponent,
        ChartCollectionIdDirective,
        ChartMarkerComponent,
        ChartPopoverComponent,
        ChartDonutContentComponent,
        ChartTooltipsComponent,
        ChartTooltipComponent,
        ChartTooltipDirective,
    ],
    exports: [
        LegendComponent,
        LegendSeriesComponent,
        RichLegendTileComponent,
        BasicLegendTileComponent,
        ChartComponent,
        ChartCollectionIdDirective,
        ChartMarkerComponent,
        ChartPopoverComponent,
        ChartDonutContentComponent,
        ChartTooltipsComponent,
        ChartTooltipComponent,
        ChartTooltipDirective,
    ],
    providers: [ChartCollectionService, ThresholdsService],
})
export class NuiChartsModule {}
