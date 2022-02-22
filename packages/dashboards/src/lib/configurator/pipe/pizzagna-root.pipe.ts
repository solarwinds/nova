import { Pipe, PipeTransform } from "@angular/core";

import { WidgetTypesService } from "../../services/widget-types.service";
import { IWidget } from "../../components/widget/types";

@Pipe({
    name: "nuiPizzagnaRoot",
    pure: true,
})
export class PizzagnaRootPipe implements PipeTransform {
    constructor(private widgetTypesService: WidgetTypesService) {
    }

    public transform(widget: IWidget | null, key: "configurator" | "widget" = "widget") {
        if (!widget?.type) {
            return null;
        }

        const widgetType = this.widgetTypesService.getWidgetType(widget.type, widget.version);

        return widgetType.paths?.[key]?.root;
    }
}
