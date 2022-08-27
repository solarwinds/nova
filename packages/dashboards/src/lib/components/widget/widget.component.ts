import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";

import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { WidgetConfigurationService } from "../../services/widget-configuration.service";
import { WidgetTypesService } from "../../services/widget-types.service";
import { IPizzagna } from "../../types";
import { IWidget } from "./types";

@Component({
    selector: "nui-widget",
    templateUrl: "./widget.component.html",
    styleUrls: ["./widget.component.less"],
    providers: [WidgetConfigurationService],
    host: { class: "nui-widget" },
})
export class WidgetComponent implements OnChanges {
    @Input() widget: IWidget;
    @Output() widgetChange = new EventEmitter<IWidget>();

    public rootNode = DEFAULT_PIZZAGNA_ROOT;

    constructor(
        private widgetConfigurationService: WidgetConfigurationService,
        private widgetTypesService: WidgetTypesService
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.widget) {
            const type = this.widget.type;
            const previousType =
                changes.widget.previousValue &&
                changes.widget.previousValue.type;
            if (previousType !== type) {
                const widgetType = this.widgetTypesService.getWidgetType(
                    type,
                    this.widget.version
                );
                this.rootNode =
                    widgetType?.paths?.widget?.root || DEFAULT_PIZZAGNA_ROOT;
            }
            this.widgetConfigurationService.updateWidget(this.widget);
        }
    }

    public onPizzagnaChange(pizzagna: IPizzagna) {
        this.widgetChange.emit({
            ...this.widget,
            pizzagna: pizzagna,
        });
    }
}
