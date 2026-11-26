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

import { DOCUMENT } from "@angular/common";
import {
    AfterRenderRef,
    Directive,
    ElementRef,
    Host,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Self,
    afterNextRender,
    inject,
} from "@angular/core";
import cloneDeep from "lodash/cloneDeep";
import { Subject } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { switchMap, takeUntil, tap } from "rxjs/operators";

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
    standalone: false,
})
export class WidgetEditorDirective implements OnInit, OnDestroy {
    @Input("nuiWidgetEditor")
    dashboardPersistenceHandler: IDashboardPersistenceHandler;

    private readonly destroy$ = new Subject<void>();
    private readonly host =
        inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    private readonly injector = inject(Injector);
    private readonly document = inject(DOCUMENT);
    private pendingFocus?: AfterRenderRef;

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
                switchMap(event => {
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
                switchMap(event => {
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
                    this.pendingFocus?.destroy();
                    this.pendingFocus = undefined;

                    const removal = this.widgetRemovalService.handleRemove(
                        this.dashboardComponent,
                        widgetId,
                        configuratorSource,
                        tryRemove
                    );
                    const payload = event.payload;
                    if (
                        typeof payload !== "object" ||
                        payload === null ||
                        !("focusOrigin" in payload) ||
                        payload.focusOrigin !== "keyboard"
                    ) {
                        return removal;
                    }

                    return removal.pipe(
                        tap(() => this.scheduleRemovalFocus(widgetId))
                    );
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.pendingFocus?.destroy();
        this.destroy$.next();
        this.destroy$.complete();
    }

    private getWidgets(): HTMLElement[] {
        return Array.from(
            this.host.querySelectorAll<HTMLElement>("nui-widget[widget-id]")
        ).filter(widget => widget.closest("nui-dashboard") === this.host);
    }

    private scheduleRemovalFocus(widgetId: string): void {
        const widgets = this.getWidgets();
        const index = widgets.findIndex(
            widget => widget.getAttribute("widget-id") === widgetId
        );
        const widget = widgets[index];
        if (!widget) {
            return;
        }

        const active = this.document.activeElement;
        const menuId = widget
            .querySelector(".nui-widget-header__action-remove button")
            ?.getAttribute("aria-controls");
        // A keyboard-opened menu may be rendered under body instead of the widget.
        if (
            !widget.contains(active) &&
            !(menuId && this.document.getElementById(menuId)?.contains(active))
        ) {
            return;
        }

        this.pendingFocus?.destroy();
        this.pendingFocus = afterNextRender(
            () => {
                this.pendingFocus = undefined;
                if (
                    !this.host.isConnected ||
                    widget.isConnected ||
                    this.dashboardComponent.dashboard.widgets[widgetId] ||
                    this.document.activeElement !== this.document.body
                ) {
                    return;
                }

                const adjacent = [widgets[index + 1], widgets[index - 1]];
                for (const neighbor of adjacent) {
                    if (
                        this.focusControl(
                            neighbor,
                            ".nui-widget-header__action-remove button:not([disabled])"
                        )
                    ) {
                        return;
                    }
                }
                for (const remaining of this.getWidgets()) {
                    if (
                        this.focusControl(
                            remaining,
                            ".nui-widget-header__action-edit:not([disabled])"
                        )
                    ) {
                        return;
                    }
                }
                if (!this.host.hasAttribute("tabindex")) {
                    this.host.tabIndex = -1;
                }
                this.host.focus();
            },
            { injector: this.injector }
        );
    }

    private focusControl(
        widget: HTMLElement | undefined,
        selector: string
    ): boolean {
        const control = widget?.querySelector<HTMLElement>(selector);
        control?.focus();
        return !!control && this.document.activeElement === control;
    }
}
