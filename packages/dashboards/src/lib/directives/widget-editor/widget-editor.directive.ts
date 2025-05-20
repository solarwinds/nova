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

import { Directive, Host, Input, OnDestroy, OnInit, Self } from "@angular/core";
import cloneDeep from "lodash/cloneDeep";
import { Subject } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { switchMap, takeUntil } from "rxjs/operators";

import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { IDashboardPersistenceHandler } from "../../components/dashboard/types";
import {
    IConfiguratorSource,
    IWidgetEditor,
} from "../../configurator/services/types";
import { WidgetEditorService } from "../../configurator/services/widget-editor.service";
import { WIDGET_EDIT, WIDGET_REMOVE } from "../../services/types";
import { WidgetRemovalService } from "../../services/widget-removal.service";
import { WidgetTypesService } from "../../services/widget-types.service";

@Directive({
    selector: "[nuiWidgetEditor]",
})
export class WidgetEditorDirective implements OnInit, OnDestroy {
    @Input("nuiWidgetEditor")
    dashboardPersistenceHandler: IDashboardPersistenceHandler;

    private readonly destroy$ = new Subject<void>();

    constructor(
        @Host() @Self() private dashboardComponent: DashboardComponent,
        private widgetEditorService: WidgetEditorService,
        private widgetRemovalService: WidgetRemovalService,
        private widgetTypesService: WidgetTypesService
    ) {}

    public ngOnInit(): void {
        this.dashboardComponent.eventBus
            .getStream(WIDGET_EDIT)
            .pipe(
                // eslint-disable-next-line import/no-deprecated
                switchMap((event) => {
                    const widget =
                        this.dashboardComponent.dashboard.widgets[
                            event.widgetId
                        ];
                    const widgetType = this.widgetTypesService.getWidgetType(
                        widget.type,
                        widget.version
                    );
                    // TODO: Ensure that widgetType is defined;
                    const widgetEditor: IWidgetEditor = {
                        dashboardComponent: this.dashboardComponent,
                        // @ts-ignore: Configurator is possibly undefined and is not assignable to IPizzagna type
                        formPizzagna: widgetType.configurator,
                        // @ts-ignore: Type 'undefined' is not assignable to type 'Record<string, string>'.
                        paths: widgetType.paths.configurator,
                        widget,
                        trySubmit:
                            this.dashboardPersistenceHandler &&
                            this.dashboardPersistenceHandler.trySubmit,
                    };

                    return this.widgetEditorService.open(widgetEditor);
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();

        this.dashboardComponent.eventBus
            .getStream(WIDGET_REMOVE)
            .pipe(
                // eslint-disable-next-line import/no-deprecated
                switchMap((event) => {
                    if (!event.widgetId) {
                        throw new Error(`event has to have widgetId`);
                    }
                    const widgetId = event.widgetId;
                    const tryRemove =
                        this.dashboardPersistenceHandler &&
                        this.dashboardPersistenceHandler.tryRemove;

                    const configuratorSource: IConfiguratorSource = {
                        dashboardComponent: this.dashboardComponent,
                        widget: cloneDeep(
                            this.dashboardComponent.dashboard.widgets[widgetId]
                        ),
                    };
                    return this.widgetRemovalService.handleRemove(
                        this.dashboardComponent,
                        widgetId,
                        configuratorSource,
                        tryRemove
                    );
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
