import { IWidget } from "../types";

export class WidgetConfigurationService {
    private widget: IWidget;

    public updateWidget(widget: IWidget) {
        this.widget = widget;
    }

    public getWidget() {
        return this.widget;
    }
}
