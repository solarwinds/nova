import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable, Injector } from "@angular/core";

import { LoggerService } from "@nova-ui/bits";

import { TemplateLoadErrorComponent } from "../../components/template-load-error/template-load-error.component";
import { IPortalEnvironment } from "../../types";
import { ComponentRegistryService } from "./component-registry.service";

/** @ignore */
@Injectable({
    providedIn: "root",
})
export class ComponentPortalService {
    constructor(
        private componentRegistry: ComponentRegistryService,
        private logger: LoggerService
    ) {}

    public createComponentPortal(
        componentType: string | Function,
        injector: Injector | null
    ): ComponentPortal<any> {
        let loadType: any;
        if (typeof componentType === "string") {
            loadType = this.componentRegistry.getComponentType(componentType);
        } else {
            loadType = componentType;
        }

        if (!loadType) {
            this.logger.error(`Cannot Find Component Type ${componentType}`);
            loadType = TemplateLoadErrorComponent;
        }

        return new ComponentPortal(loadType, null, injector);
    }

    public createInjector(environment: IPortalEnvironment): Injector {
        const providers = environment.providers || [];
        return Injector.create({
            providers,
            parent: environment.injector,
            name: "Component Injector",
        });
    }
}
