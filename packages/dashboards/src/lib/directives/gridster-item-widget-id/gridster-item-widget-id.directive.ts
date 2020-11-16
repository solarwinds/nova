import { Directive, Host, Input, OnChanges, Self, SimpleChanges } from "@angular/core";
import { GridsterItemComponent } from "angular-gridster2";

/**
 * This directive assigns a "widgetId" property to host gridster item. We need it there because moving and resizing the widget with gridster only contains
 * gridster position data and gridster component payload, so we need to identify which widget that event belongs to.
 */
@Directive({
    selector: "[nuiGridsterItemWidgetId]",
})
export class GridsterItemWidgetIdDirective implements OnChanges {
    @Input() nuiGridsterItemWidgetId: string;

    constructor(@Host() @Self() private gridsterItem: GridsterItemComponent) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.nuiGridsterItemWidgetId) {
            (this.gridsterItem as any).widgetId = this.nuiGridsterItemWidgetId;
        }
    }

}
