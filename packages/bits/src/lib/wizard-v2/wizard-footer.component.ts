import {FocusableOption, FocusMonitor} from "@angular/cdk/a11y";
import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewEncapsulation
} from "@angular/core";

import {WizardStepFooterDirective} from "./wizard-step-footer.directive";

@Component({
    selector: "wizard-footer",
    templateUrl: "wizard-footer.component.html",
    styleUrls: ["wizard-footer.component.less"],
    host: {
        "class": "nui-wizard-footer",
        "role": "tab",
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardFooterComponent implements FocusableOption, AfterViewInit, OnDestroy {
    /** Label of the given step. */
    @Input() footer: WizardStepFooterDirective | string;

    constructor(
        private _focusMonitor: FocusMonitor,
        private _elementRef: ElementRef<HTMLElement>
    ) {}

    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true);
    }

    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    /** Focuses the step footer. */
    focus() {
        this._focusMonitor.focusVia(this._elementRef, "program");
    }

    /** Returns wizardStepFooter if the footer of the current step */
    _templateFooter(): WizardStepFooterDirective | null {
        return this.footer instanceof WizardStepFooterDirective ? this.footer : null;
    }
}
