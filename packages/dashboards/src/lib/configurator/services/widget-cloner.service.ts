import { ComponentRef, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ComponentPortalService } from "../../pizzagna/services/component-portal.service";
import { WidgetClonerComponent } from "../components/widget-cloner/widget-cloner.component";

import { ConfiguratorService } from "./configurator.service";
import { IComponentPortalBundle, IWidgetSelector } from "./types";

@Injectable()
export class WidgetClonerService {
    constructor(
        private configuratorService: ConfiguratorService,
        private componentPortalService: ComponentPortalService
    ) {}

    public open(cloner: IWidgetSelector): Observable<void> {
        if (!cloner.portalBundle) {
            const formPortal: IComponentPortalBundle<WidgetClonerComponent> = {
                portal: this.componentPortalService.createComponentPortal(
                    WidgetClonerComponent,
                    null
                ),
                attached: (
                    componentRef: ComponentRef<WidgetClonerComponent>
                ) => {
                    componentRef.instance.cloneSelectionComponentType =
                        cloner.widgetSelectionComponentType;
                },
            };

            cloner.portalBundle = formPortal;
        }

        return this.configuratorService.open(cloner);
    }
}
