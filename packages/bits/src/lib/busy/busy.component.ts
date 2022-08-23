import {
    AfterContentInit,
    Component,
    ContentChild,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
} from "@angular/core";

import { TabNavigationService } from "../../services/tab-navigation.service";
import { ProgressComponent } from "../progress/progress.component";
import { SpinnerComponent } from "../spinner/spinner.component";

/**
 * <example-url>./../examples/index.html#/busy</example-url>
 */

/* eslint-disable @angular-eslint/component-selector */
@Component({
    selector: "[nui-busy]",
    templateUrl: "./busy.component.html",
    styleUrls: ["./busy.component.less"],
    providers: [TabNavigationService],
    encapsulation: ViewEncapsulation.None,
    host: { "[attr.aria-busy]": "busy" },
})
/* eslint-enable @angular-eslint/component-selector */
export class BusyComponent implements AfterContentInit, OnChanges {
    public isDefaultTemplate = false;
    public isSpinnerTemplate = false;
    public isProgressTemplate = false;

    @Input() busy: boolean;

    /**
     * When busy is true, by default we disable keyboard tab navigation for all underlying elements
     */
    @Input() disableTabNavigation: boolean = true;

    @ContentChild(SpinnerComponent) spinnerComponent: SpinnerComponent;
    @ContentChild(ProgressComponent) progressComponent: ProgressComponent;

    constructor(
        private tabNavigationService: TabNavigationService,
        private elRef: ElementRef
    ) {}

    public ngAfterContentInit() {
        this.setBusyStateForContentComponents();

        this.isSpinnerTemplate = Boolean(this.spinnerComponent);
        this.isProgressTemplate = Boolean(this.progressComponent);
        if (this.spinnerComponent && this.progressComponent) {
            this.isSpinnerTemplate = false;
            this.isProgressTemplate = false;
            this.isDefaultTemplate = true;
        }
        if (!this.spinnerComponent && !this.progressComponent) {
            this.isDefaultTemplate = true;
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (
            this.disableTabNavigation &&
            changes.busy?.currentValue !== undefined
        ) {
            if (this.busy) {
                this.tabNavigationService.disableTabNavigation(this.elRef);
            } else {
                this.tabNavigationService.restoreTabNavigation();
            }
        }

        this.setBusyStateForContentComponents();
    }

    private setBusyStateForContentComponents() {
        if (this.spinnerComponent) {
            this.spinnerComponent.showSpinner = this.busy;
        }
        if (this.progressComponent) {
            this.progressComponent.show = this.busy;
        }
    }
}
