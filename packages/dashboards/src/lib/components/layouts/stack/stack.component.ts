import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";

import { LoggerService } from "@nova-ui/bits";

import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { BaseLayout } from "../base-layout";

@Component({
    selector: "nui-stack",
    templateUrl: "./stack.component.html",
})
export class StackComponent extends BaseLayout implements OnInit, OnDestroy {
    public static lateLoadKey = "StackComponent";

    @Input() nodes: string[] = [];
    @Input() direction = "column";
    @Input() elementClass = "";

    @HostBinding("class") public classNames: string;
    public readonly defaultClassNames = "h-100 w-100 d-flex";

    constructor(
        changeDetector: ChangeDetectorRef,
        pizzagnaService: PizzagnaService,
        logger: LoggerService
    ) {
        super(changeDetector, pizzagnaService, logger);
    }

    public ngOnInit(): void {
        this.classNames = `${this.defaultClassNames} flex-${this.direction} ${this.elementClass}`;
    }

    public ngOnDestroy() {
        // Ensures that any base class observables are unsubscribed.
        super.ngOnDestroy();
    }

    public getNodes(): string[] {
        return this.nodes;
    }
}
