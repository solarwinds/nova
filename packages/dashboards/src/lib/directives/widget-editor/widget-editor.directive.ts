import { Directive, Host, Input, OnDestroy, OnInit, Self } from "@angular/core";
import cloneDeep from "lodash/cloneDeep";
import { Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import {
    IConfiguratorSource,
    IWidgetEditor,
} from "../../configurator/services/types";
import { WidgetEditorService } from "../../configurator/services/widget-editor.service";
import { WIDGET_EDIT, WIDGET_REMOVE } from "../../services/types";
import { WidgetRemovalService } from "../../services/widget-removal.service";
import { WidgetTypesService } from "../../services/widget-types.service";
import { IDashboardPersistenceHandler } from "../../components/dashboard/types";

@Directive({
    selector: "[nuiWidgetEditor]",
})
export class WidgetEditorDirective implements OnInit, OnDestroy {
    @Input("nuiWidgetEditor")
    dashboardPersistenceHandler: IDashboardPersistenceHandler;

    private destroy$ = new Subject();

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
                switchMap((event) => {
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
