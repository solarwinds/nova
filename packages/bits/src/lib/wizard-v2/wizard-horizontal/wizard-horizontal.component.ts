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
import without from "lodash/without";
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
        "[class.nui-wizard-step-header__label-position--end]": "labelPosition == 'end'",
        "[class.nui-wizard-step-header__label-position--top]": "labelPosition == 'top'",
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

    private headerResizeObserver: ResizeObserver;
    private dynamicSteps: WizardStepV2Component[] = [];
    private stepsCachedArray: WizardStepV2Component[] = [];
    private dynamicStepWidthAdjustment: number = 0;

    public hasOverflow = false;
    public isInResponsiveMode = false;
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

        this.stepsCachedArray = [...this.stepsArray];
        this.stepHeaderWidth = this.stepHeaders.first._elementRef.nativeElement?.getBoundingClientRect().width;
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
                this.checkResponsiveMode();
                this.cdRef.markForCheck();
            });
        });

        this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe((steps: QueryList<WizardStepV2Component>) => {
            this.dynamicSteps =
                this.stepsArray.length >= this.stepsCachedArray.length
                    ? without(this.stepsArray, ...this.stepsCachedArray)
                    : without(this.stepsCachedArray, ...this.stepsArray);

            if (this.dynamicSteps.length) {
                this.getWidthsForCalculations();
                this.handleOverflow();
            }

            this.dynamicStepWidthAdjustment = this.stepsArray.includes(this.dynamicSteps[0]) ? this.stepHeaderWidth : 0;
            this.stepsCachedArray = [...this.stepsArray];
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

    public handleOverflow(): void {
        this.checkOverflow();
        this.checkResponsiveMode();

        if (this.hasOverflow || this.isInResponsiveMode) {
            const headerPaddings: number = +getComputedStyle(this.headerContainer.nativeElement).paddingLeft.slice(0, -2);
            const numberOfVisibleItems = Math.ceil((this.headerContainerWidth - headerPaddings * 2) / this.stepHeaderWidth) - 1;

            if (!this.state?.finished) {
                if (!this.isInResponsiveMode) {
                    this.visibleSteps = this.stepsArray.slice(0, numberOfVisibleItems);
                    this.overflownStepsEnd = this.stepsArray.slice(numberOfVisibleItems);
                } else {
                    this.handleDynamicHeaderChanges(numberOfVisibleItems);
                }
            } else {
                if (!this.isInResponsiveMode) {
                    this.visibleSteps = this.stepsArray.slice(-numberOfVisibleItems);
                    this.overflownStepsStart = this.stepsArray.slice(0, -numberOfVisibleItems);
                } else {
                    this.handleDynamicHeaderChanges(numberOfVisibleItems);
                }
            }
        }

        this.checkResponsiveMode();
    }

    private handleDynamicHeaderChanges(visibleItemsNUmber: number) {
        const arr: WizardStepV2Component[] = [...this.stepsArray];
        const overflowStartChunk = arr.slice(0, this.overflownStepsStart.length);

        if (this.overflownStepsStart.length) {
            overflowStartChunk.includes(this.dynamicSteps[0])
                ? this.overflownStepsStart = [...arr.splice(0, this.overflownStepsStart.length + this.dynamicSteps.length)]
                : this.overflownStepsStart = [...arr.splice(0, this.overflownStepsStart.length - this.dynamicSteps.length)];
        }
        this.visibleSteps = arr.slice(0, visibleItemsNUmber);
        this.overflownStepsEnd = arr.slice(visibleItemsNUmber);

        this.checkOverflow();
        if (!this.hasOverflow && this.overflownStepsStart.length) {
            this.visibleSteps.unshift(this.overflownStepsStart.splice(this.overflownStepsStart.length - 1, 1)[0]);
        }
    }

    private getWidthsForCalculations() {
        this.headerContainerWidth = this.headerContainer.nativeElement?.getBoundingClientRect().width;
        this.allHeadersWidth = this.stepHeaderWidth * this.steps.length;
    }

    private checkOverflow(): void {
        this.hasOverflow = this.allHeadersWidth > this.headerContainerWidth;
    }

    private checkResponsiveMode(): void {
        this.isInResponsiveMode = !!this.overflownStepsStart.length || !!this.overflownStepsEnd.length;
    }

    private onContainerResize(entry: ResizeObserverEntry) {
        this.checkOverflow();

        const newWidth = entry.contentRect.width;
        const visibleStepsWidth = this.visibleSteps.length * this.stepHeaderWidth;

        if (newWidth < (visibleStepsWidth + this.overflowComponentWidth * 2 + this.dynamicStepWidthAdjustment)) {
            if (this.visibleSteps[0] !== this.stepsArray[this.selectedIndex]) {
                return this.overflownStepsStart.push(this.visibleSteps.splice(0, 1)[0]);
            }

            if (this.visibleSteps[this.visibleSteps.length - 1] !== this.stepsArray[this.selectedIndex]) {
                return  this.overflownStepsEnd.unshift(this.visibleSteps.splice(-1, 1)[0]);
            }
        }

        if (newWidth > (visibleStepsWidth + this.stepHeaderWidth + this.overflowComponentWidth * 2 + this.dynamicStepWidthAdjustment)) {
            if (this.overflownStepsEnd.length) {
                return this.visibleSteps.push(this.overflownStepsEnd.splice(0, 1)[0]);
            }

            if (this.overflownStepsStart.length) {
                return  this.visibleSteps.unshift(this.overflownStepsStart.splice(-1, 1)[0]);
            }
        }
    }
}
