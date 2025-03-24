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

import { ComponentRef, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ConfiguratorService } from "./configurator.service";
import { IComponentPortalBundle, IWidgetSelector } from "./types";
import { ComponentPortalService } from "../../pizzagna/services/component-portal.service";
import { WidgetClonerComponent } from "../components/widget-cloner/widget-cloner.component";

@Injectable()
export class WidgetClonerService {

    private ref: ComponentRef<WidgetClonerComponent>;

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
                    setTimeout(() => {
                        this.ref = componentRef;
                    });
                },
            };

            cloner.portalBundle = formPortal;
        }

        cloner.previewPizzagnaComponent = () => this.ref.instance.configurator.getPreview();


        return this.configuratorService.open(cloner);
    }
}
