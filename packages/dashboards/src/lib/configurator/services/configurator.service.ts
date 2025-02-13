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

import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Injectable,
    Injector,
    Optional,
    Renderer2,
    RendererFactory2, ViewContainerRef,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import cloneDeep from "lodash/cloneDeep";
import isFunction from "lodash/isFunction";
import { EMPTY, Observable, of, Subject } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { catchError, filter, switchMap, takeUntil } from "rxjs/operators";

import { LoggerService, uuid } from "@nova-ui/bits";

import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { IWidget } from "../../components/widget/types";
import { WidgetUpdateOperation } from "../../configurator/services/types";
import { WidgetTypesService } from "../../services/widget-types.service";
import { ConfiguratorComponent } from "../components/configurator/configurator.component";
import { IConfigurator, IConfiguratorSource } from "./types";

@Injectable()
export class ConfiguratorService {
    private renderer: Renderer2;
    private componentRef: ComponentRef<ConfiguratorComponent>;
    private close$: Subject<void> = new Subject<void>();

    constructor(
        private widgetTypesService: WidgetTypesService,
        private injector: Injector,
        private appRef: ApplicationRef,
        public viewContainerRef: ViewContainerRef,
        private logger: LoggerService,
        rendererFactory: RendererFactory2,
        @Optional() private router: Router
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    public open(configurator: IConfigurator): Observable<void> {
        const source: IConfiguratorSource = {
            dashboardComponent: configurator.dashboardComponent,
            previewPizzagnaComponent: configurator.previewPizzagnaComponent,
            widget: cloneDeep(configurator.widget),
        };

        this.componentRef = this.appendComponentToBody();
        const component: ConfiguratorComponent = this.componentRef.instance;

        // TODO: Handle the case when portalBundle is undefined
        // @ts-ignore
        component.formPortal = configurator.portalBundle.portal;
        // TODO: Handle the case when widget is undefined
        // @ts-ignore
        component.previewWidget = cloneDeep(configurator.widget);
        if (configurator.portalBundle?.attached) {
            component.formPortalAttached
                .pipe(takeUntil(this.close$))
                .subscribe(configurator.portalBundle.attached);
        }

        component.changeDetector.detectChanges();

        return (
            component.result
                .asObservable()
                // TODO: Handle the case when trySubmit is undefined
                // @ts-ignore
                .pipe(this.handleSubmit(source, configurator.trySubmit))
        );
    }

    public close(): void {
        if (!this.renderer) {
            return;
        }

        this.close$.next();
        this.renderer.removeChild(
            document.body,
            (this.componentRef.hostView as EmbeddedViewRef<any>)
                .rootNodes[0] as HTMLElement
        );
        this.appRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();

        this.renderer.removeStyle(document.body, "overflow");
    }

    public handleSubmit =
        (confSource: IConfiguratorSource, trySubmit: WidgetUpdateOperation) =>
        (source: Observable<IWidget>): Observable<void> =>
            source.pipe(
                this.trySubmit(trySubmit, confSource),
                this.updateDashboard(confSource.dashboardComponent)
            );

    private trySubmit =
        (trySubmit: WidgetUpdateOperation, confSource: IConfigurator) =>
        (source: Observable<IWidget>) =>
            source.pipe(
                // eslint-disable-next-line import/no-deprecated
                switchMap((widget: IWidget) => {
                    if (widget && isFunction(trySubmit)) {
                        return trySubmit(widget, confSource).pipe(
                            catchError((err: any) => {
                                this.logger.error(err);
                                this.componentRef.instance.handleSubmitError();
                                return EMPTY;
                            })
                        );
                    } else {
                        return of(widget);
                    }
                })
            );

    private updateDashboard =
        (dashboardComponent: DashboardComponent) =>
        (source: Observable<IWidget>) =>
            new Observable<void>((observer) =>
                source.subscribe((widget: IWidget) => {
                    if (widget) {
                        widget.id = widget.id || uuid();

                        let widgetToSet: IWidget;
                        const dashboardWidget =
                            dashboardComponent.dashboard.widgets[widget.id];
                        if (dashboardWidget) {
                            widgetToSet = {
                                ...widget,
                                pizzagna: {
                                    ...this.widgetTypesService.getWidgetType(
                                        widget.type,
                                        widget.version
                                    ).widget,
                                    configuration:
                                        widget.pizzagna.configuration,
                                },
                            };
                        } else {
                            widgetToSet = widget;
                        }

                        // first we remove the widget so that we can recreate it from scratch
                        dashboardComponent.removeWidget(
                            widgetToSet.id,
                            false /* this is set to preserve the widget location */
                        );

                        // then we wait for the removal to take effect and we create the widget again
                        setTimeout(() => {
                            dashboardComponent.updateWidget(widgetToSet);
                        });
                    }

                    this.close();
                    observer.next();
                })
            );

    private appendComponentToBody(): ComponentRef<ConfiguratorComponent> {
        const componentRef: ComponentRef<ConfiguratorComponent> = this.viewContainerRef.createComponent(
            ConfiguratorComponent, {injector: this.injector});


        this.appRef.attachView(componentRef.hostView);
        this.renderer.appendChild(
            document.body,
            (componentRef.hostView as EmbeddedViewRef<any>)
                .rootNodes[0] as HTMLElement
        );
        this.renderer.setStyle(document.body, "overflow", "hidden");
        if (this.router) {
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    takeUntil(this.close$)
                )
                .subscribe(() => this.close());
        }
        return componentRef;
    }
}
