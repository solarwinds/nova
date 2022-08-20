import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { EventBus, IEvent, LoggerService } from "@nova-ui/bits";
import { takeUntil } from "rxjs/operators";

import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { DASHBOARD_EDIT_MODE } from "../../../services/types";
import { PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../types";
import { BaseLayout } from "../../layouts/base-layout";

@Component({
    selector: "nui-widget-body",
    templateUrl: "./widget-body.component.html",
    styleUrls: ["./widget-body.component.less"],
})
export class WidgetBodyComponent
    extends BaseLayout
    implements OnInit, OnDestroy
{
    public static lateLoadKey = "WidgetBodyComponent";

    /**
     * The component's id
     */
    @Input() public componentId: string;

    /**
     * Keeps track of whether the dashboard is in edit mode
     */
    @Input() public editMode = false;

    /**
     * Pizzagna key for the widget body content
     */
    @Input() public content: string;

    /**
     * Optional class for styling
     */
    @Input() public elementClass = "";

    @HostBinding("class") public classNames: string;

    public readonly defaultClasses = "d-flex h-100 w-100";

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        changeDetector: ChangeDetectorRef,
        pizzagnaService: PizzagnaService,
        logger: LoggerService
    ) {
        super(changeDetector, pizzagnaService, logger);
    }

    public ngOnInit() {
        this.classNames = `${this.defaultClasses} ${this.elementClass}`;

        // subscribing to dashboard event to set 'edit mode'
        this.eventBus
            .getStream(DASHBOARD_EDIT_MODE)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((event) => {
                this.pizzagnaService.setProperty(
                    {
                        componentId: this.componentId,
                        pizzagnaKey: PizzagnaLayer.Data,
                        propertyPath: ["editMode"],
                    },
                    !!event.payload
                );
            });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public getNodes = (): string[] => [this.content];
}
