import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { ChartDonutContentPlugin } from "../core/plugins/chart-donut-content-plugin";
import { IElementPosition } from "../core/plugins/types";

@Component({
    selector: "nui-chart-donut-content",
    templateUrl: "./chart-donut-content.component.html",
    styleUrls: ["./chart-donut-content.component.less"],
})
export class ChartDonutContentComponent implements OnDestroy, OnInit {

    /** The plugin instance */
    @Input() public plugin: ChartDonutContentPlugin;

    /** The current content position */
    public contentPosition: IElementPosition;

    private contentPositionUpdateSubscription: Subscription;

    public ngOnInit() {
        this.contentPositionUpdateSubscription = this.plugin.contentPositionUpdateSubject.subscribe((contentPosition: IElementPosition) => {
            this.contentPosition = contentPosition;
        });
        this.plugin.chart.updateDimensions();
    }

    public ngOnDestroy() {
        if (this.contentPositionUpdateSubscription) {
            this.contentPositionUpdateSubscription.unsubscribe();
        }
    }
}
