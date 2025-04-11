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
import cloneDeep from "lodash/cloneDeep";
import { Observable } from "rxjs";

import { ConfiguratorService } from "./configurator.service";
import { IComponentPortalBundle, IWidgetEditor } from "./types";
import { IWidget } from "../../components/widget/types";
import { ComponentPortalService } from "../../pizzagna/services/component-portal.service";
import { PizzagnaLayer } from "../../types";
import { WidgetEditorComponent } from "../components/widget-editor/widget-editor.component";

@Injectable()
export class WidgetEditorService {
    private ref: ComponentRef<WidgetEditorComponent>;

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
                    setTimeout(() => {
                        this.ref = componentRef;
                    });
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
        widgetEditor.previewPizzagnaComponent = () =>
            this.ref.instance.configurator.getPreview();
        return this.configuratorService.open(widgetEditor);
    }
}
