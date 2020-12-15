import { ChangeDetectorRef, Component, HostBinding, Input, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { LoggerService } from "@nova-ui/bits";

import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { ErrorNodeKey } from "../../../widget-types/common/widget/types";
import { BaseLayout } from "../../layouts/base-layout";

@Component({
    selector: "nui-widget-body-content",
    templateUrl: "./widget-body-content.component.html",
})
export class WidgetBodyContentComponent extends BaseLayout implements OnChanges, OnInit, OnDestroy {
    public static lateLoadKey = "WidgetBodyContentComponent";

    /**
     * The component's id
     */
    @Input() public componentId: string;

    /**
     * The pizzagna node to use for the primary content
     */
    @Input() public primaryContent: string;

    /**
     * When this property is populated, the component displays the associated
     * fallback content in place of the primary content
     */
    @Input() public fallbackKey: string;

    /**
     * Map of content keys to pizzagna nodes
     */
    @Input() public fallbackMap: Record<string, string>;

    /**
     * Optional class for styling
     */
    @Input() public elementClass = "";

    @HostBinding("class") public classNames: string;

    public readonly defaultClasses = "w-100";

    constructor(changeDetector: ChangeDetectorRef,
                pizzagnaService: PizzagnaService,
                logger: LoggerService) {
        super(changeDetector, pizzagnaService, logger);
    }

    public ngOnInit() {
        this.classNames = `${this.defaultClasses} ${this.elementClass}`;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public getNodes(): string[] {
        if (this.fallbackKey) {
            const fallbackContent = (this.fallbackMap && this.fallbackMap[this.fallbackKey]) || ErrorNodeKey.ErrorUnknown;
            return [this.primaryContent, fallbackContent];
        }
        return [this.primaryContent];
    }
}
