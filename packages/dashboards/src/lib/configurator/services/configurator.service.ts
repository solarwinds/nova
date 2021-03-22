import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Injectable,
    Injector,
    Optional,
    Renderer2,
    RendererFactory2,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { LoggerService, uuid } from "@nova-ui/bits";
import cloneDeep from "lodash/cloneDeep";
import isFunction from "lodash/isFunction";
import { EMPTY, Observable, of, Subject } from "rxjs";
import { catchError, filter, switchMap, takeUntil } from "rxjs/operators";

import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { WidgetTypesService } from "../../services/widget-types.service";
import { IWidget, WidgetUpdateOperation } from "../../types";
import { ConfiguratorComponent } from "../components/configurator/configurator.component";

import { IConfigurator, IConfiguratorSource } from "./types";

@Injectable()
export class ConfiguratorService {
    private renderer: Renderer2;
    private componentRef: ComponentRef<ConfiguratorComponent>;
    private close$: Subject<void> = new Subject();

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private widgetTypesService: WidgetTypesService,
        private injector: Injector,
        private appRef: ApplicationRef,
        private logger: LoggerService,
        rendererFactory: RendererFactory2,
        @Optional() private router: Router
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    public open(configurator: IConfigurator): Observable<void> {
        const source: IConfiguratorSource = {
            dashboardComponent: configurator.dashboardComponent,
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

    public handleSubmit = (
        confSource: IConfiguratorSource,
        trySubmit: WidgetUpdateOperation
    ) => (source: Observable<IWidget>) =>
        source.pipe(
            this.trySubmit(trySubmit, confSource),
            this.updateDashboard(confSource.dashboardComponent)
        );

    private trySubmit = (
        trySubmit: WidgetUpdateOperation,
        confSource: IConfigurator
    ) => (source: Observable<IWidget>) =>
        source.pipe(
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

    private updateDashboard = (dashboardComponent: DashboardComponent) => (
        source: Observable<IWidget>
    ) =>
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
                                configuration: widget.pizzagna.configuration,
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
        const factory = this.componentFactoryResolver.resolveComponentFactory(
            ConfiguratorComponent
        );
        const componentRef: ComponentRef<ConfiguratorComponent> = factory.create(
            this.injector
        );

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
