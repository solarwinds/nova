import { Directionality } from "@angular/cdk/bidi";
import { BooleanInput } from "@angular/cdk/coercion";
import { CdkStepper, StepperSelectionEvent } from "@angular/cdk/stepper";
import { DOCUMENT } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from "@angular/core";
import ResizeObserver from "resize-observer-polyfill";
import { takeUntil } from "rxjs/operators";

import { wizardAnimations } from "../wizard-animations/wizard-animations";
import { WizardOverflowComponent } from "../wizard-overflow/wizard-overflow.component";
import { WizardStepHeaderComponent } from "../wizard-step-header/wizard-step-header.component";
import { WizardStepV2Component } from "../wizard-step/wizard-step.component";
import { WizardDirective } from "../wizard.directive";

@Component({
    selector: "nui-wizard-horizontal",
    exportAs: "wizardHorizontal",
    templateUrl: "wizard-horizontal.component.html",
    styleUrls: ["../wizard.component.less"],
    host: {
        "class": "nui-wizard-horizontal-layout",
        "[class.nui-wizard-label-position-end]": "labelPosition == 'end'",
        "[class.nui-wizard-label-position-top]": "labelPosition == 'top'",
        "aria-orientation": "horizontal",
        "role": "tablist",
    },
    animations: [wizardAnimations.horizontalStepTransition],
    providers: [
        {provide: WizardDirective, useExisting: WizardHorizontalComponent},
        {provide: CdkStepper, useExisting: WizardHorizontalComponent},
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardHorizontalComponent extends WizardDirective implements OnInit, AfterViewInit, OnDestroy {
    static ngAcceptInputTypeEditable: BooleanInput = undefined;
    static ngAcceptInputTypeOptional: BooleanInput = undefined;
    static ngAcceptInputTypeCompleted: BooleanInput = undefined;
    static ngAcceptInputTypeHasError: BooleanInput = undefined;

    private stepHeadersArray: HTMLElement[];
    private headerResizeObserver: ResizeObserver;

    public hasOverflow = false;
    public headerContainerWidth: number = 0;
    public stepHeaderWidth: number = 0;
    public overflowComponentWidth: number = 0;
    public allHeadersWidth: number = 0;
    public visibleSteps: Array<WizardStepV2Component> = [];
    public overflownStepsStart: Array<WizardStepV2Component> = [];
    public overflownStepsEnd: Array<WizardStepV2Component> = [];
    
    public get selectedIndex(): number {
        return super.selectedIndex;
    }
    @Input()
    public set selectedIndex(value: number) {
        super.selectedIndex = value;
    }

    /** Whether the label should display in bottom or end position. */
    @Input() labelPosition: "top" | "end" = "top";

    @ViewChild("headerContainer") public headerContainer: ElementRef;
    @ViewChildren("stepHeaders") public stepHeaders: QueryList<WizardStepHeaderComponent>;
    @ViewChildren("overflowComponent") public overflowComponents: QueryList<WizardOverflowComponent>;

    constructor(private dir: Directionality,
                private cdRef: ChangeDetectorRef,
                private el: ElementRef,
                private zone: NgZone,
                @Inject(DOCUMENT) private document: Document) {
        super(dir, cdRef, el, document);
    }

    ngOnInit(): void {
        // Checking the validity of previous steps by default.
        this.linear = true;
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.convertStepHeaders(this.stepHeaders);
        this.getWidthsForCalculations();
        this.handleOverflow();
        this.cdRef.detectChanges();

        this.overflowComponentWidth = this.overflowComponents?.first?.el?.nativeElement?.getBoundingClientRect()?.width || 0;

        this.headerResizeObserver = new ResizeObserver((entry: ResizeObserverEntry[]) => {
            this.zone.run(() => {
                if (!this.hasOverflow) {
                    this.getWidthsForCalculations();
                    this.handleOverflow();
                }
                this.onContainerResize(entry[0]);
                this.cdRef.markForCheck();
            });
        });

        this.selectionChange
            .pipe(takeUntil(this._destroyed))
            .subscribe((event: StepperSelectionEvent) => {

                if (this.hasOverflow) {
                    if (event.previouslySelectedIndex < event.selectedIndex) {
                        if (this.overflownStepsEnd.length) {
                            const selectedIndex = this.overflownStepsEnd.findIndex((item) => item === event.selectedStep as WizardStepV2Component);
                            this.visibleSteps = this.visibleSteps.concat(this.overflownStepsEnd.splice(0, selectedIndex + 1));
                            this.overflownStepsStart = this.overflownStepsStart.concat(this.visibleSteps.splice(0, selectedIndex + 1));
                        }
                    } else {
                        if (this.overflownStepsStart.length) {
                            const startPiece = this.overflownStepsStart.splice(event.selectedIndex, this.overflownStepsStart.length - event.selectedIndex);
                            this.visibleSteps = startPiece.concat(this.visibleSteps);
                            this.overflownStepsEnd.splice(0, 0, ...this.visibleSteps.splice(this.visibleSteps.length - startPiece.length, startPiece.length));
                        }
                    }
                }
            });

        this.headerResizeObserver.observe(this.headerContainer.nativeElement);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();

        this.headerResizeObserver.disconnect();
    }

    public handleOverflow() {

        if (this.allHeadersWidth > this.headerContainerWidth) {
            this.hasOverflow = true;
        }

        if (this.hasOverflow) {
            const headerPaddings: number = +getComputedStyle(this.headerContainer.nativeElement).paddingLeft.slice(0, -2);
            const numberOfVisibleItems = Math.ceil((this.headerContainerWidth - headerPaddings * 2) / this.stepHeaderWidth) - 1;

            if (!this.state?.finished) {
                this.visibleSteps = this.stepsArray.slice(0, numberOfVisibleItems);
                this.overflownStepsEnd = this.stepsArray.slice(numberOfVisibleItems);
            } else {
                this.visibleSteps = this.stepsArray.slice(-numberOfVisibleItems);
                this.overflownStepsStart = this.stepsArray.slice(0, -numberOfVisibleItems);
            }
        }
    }

    private getWidthsForCalculations() {
        this.headerContainerWidth = this.headerContainer.nativeElement?.getBoundingClientRect().width;
        this.stepHeaderWidth = this.stepHeadersArray[0]?.getBoundingClientRect().width;
        this.allHeadersWidth = this.stepHeadersArray.reduce((acc, item) => acc + item.getBoundingClientRect().width, 0);
    }

    private convertStepHeaders(steps: QueryList<WizardStepHeaderComponent>) {
        this.stepHeadersArray = steps.toArray().map(component => component._elementRef.nativeElement);
    }

    private onContainerResize(entry: ResizeObserverEntry) {
        const newWidth = entry.contentRect.width;
        const visibleStepsWidth = this.visibleSteps.length * this.stepHeaderWidth;

        if (newWidth < (visibleStepsWidth + this.overflowComponentWidth * 2)) {

            if (this.visibleSteps[0] !== this.stepsArray[this.selectedIndex]) {
                return this.overflownStepsStart.push(this.visibleSteps.splice(0, 1)[0]);
            }

            if (this.visibleSteps[this.visibleSteps.length - 1] !== this.stepsArray[this.selectedIndex]) {
                return  this.overflownStepsEnd.unshift(this.visibleSteps.splice(-1, 1)[0]);
            }
        }

        if (newWidth > (visibleStepsWidth + this.stepHeaderWidth + this.overflowComponentWidth * 2)) {

            if (this.overflownStepsEnd.length) {
                return this.visibleSteps.push(this.overflownStepsEnd.splice(0, 1)[0]);
            }

            if (this.overflownStepsStart.length) {
                return  this.visibleSteps.unshift(this.overflownStepsStart.splice(-1, 1)[0]);
            }
        }
    }
}
