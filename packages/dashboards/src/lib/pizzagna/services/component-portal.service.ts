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
