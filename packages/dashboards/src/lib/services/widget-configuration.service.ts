import { IWidget } from "../types";
import { Injectable } from "@angular/core";

@Injectable()
export class WidgetConfigurationService {
    private widget: IWidget;

    public updateWidget(widget: IWidget) {
        this.widget = widget;
    }

    public getWidget() {
        return this.widget;
    }
}
