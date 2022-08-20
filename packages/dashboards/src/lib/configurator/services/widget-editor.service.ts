import { Injectable } from "@angular/core";
import cloneDeep from "lodash/cloneDeep";
import { Observable } from "rxjs";

import { ComponentPortalService } from "../../pizzagna/services/component-portal.service";
import { PizzagnaLayer } from "../../types";
import { WidgetEditorComponent } from "../components/widget-editor/widget-editor.component";
import { IWidget } from "../../components/widget/types";

import { ConfiguratorService } from "./configurator.service";
import { IComponentPortalBundle, IWidgetEditor } from "./types";

@Injectable()
export class WidgetEditorService {
    constructor(
        private configuratorService: ConfiguratorService,
        private componentPortalService: ComponentPortalService
    ) {}

    public open(widgetEditor: IWidgetEditor): Observable<void> {
        if (!widgetEditor.portalBundle) {
            const formPortal: IComponentPortalBundle<WidgetEditorComponent> = {
                portal: this.componentPortalService.createComponentPortal(
                    WidgetEditorComponent,
                    null
                ),
                attached: (componentRef) => {
                    const editorComponent = componentRef.instance;
                    editorComponent.formPizzagna = widgetEditor.formPizzagna;
                    editorComponent.formRoot = widgetEditor.paths?.root;
                    editorComponent.changeDetector.markForCheck();
                },
            };

            widgetEditor.portalBundle = formPortal;
        }

        // TODO: Handle the case when widget is undefined
        // @ts-ignore
        const widgetClone: IWidget = cloneDeep(widgetEditor.widget);
        // wipe the data layer of the preview
        delete widgetClone.pizzagna[PizzagnaLayer.Data];
        widgetEditor.widget = widgetClone;

        return this.configuratorService.open(widgetEditor);
    }
}
