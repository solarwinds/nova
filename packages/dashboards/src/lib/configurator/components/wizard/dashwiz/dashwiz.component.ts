import {
    AfterContentInit,
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ContentChildren,
    DoCheck,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
} from "@angular/core";
import { IBusyConfig, IEvent, LoggerService } from "@nova-ui/bits";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import isUndefined from "lodash/isUndefined";
import { BehaviorSubject } from "rxjs";

import { DashwizStepComponent } from "../dashwiz-step/dashwiz-step.component";
import { IDashwizButtonsComponent, IDashwizStepComponent, IDashwizStepNavigatedEvent, IDashwizWaitEvent } from "../types";

import { DashwizButtonsComponent } from "./dashwiz-buttons.component";
import { DashwizService } from "./dashwiz.service";

/**
 * Component that provides wizard functionality.
 */
@Component({
    selector: "nui-dashwiz",
    templateUrl: "./dashwiz.component.html",
    styleUrls: ["./dashwiz.component.less"],
    host: { class: "flex-grow-1 overflow-auto" },
})
export class DashwizComponent implements OnInit, AfterContentInit, AfterViewChecked, OnDestroy, DoCheck {
    private static placeholderFinishText = "Action"; // as a placeholder "Action" does not need to be i18n

    @ContentChildren(DashwizStepComponent) steps: QueryList<DashwizStepComponent>;
    @ViewChildren("stepTitle") stepTitles: QueryList<ElementRef>;
    @ViewChild("container", { read: ViewContainerRef }) dynamicStep: any;

    /**
     * Set to true to hide the wizard header including the step breadcrumbs.
     * (default: false)
     */
    @Input() public hideHeader = false;
    /**
     * Set to true to show the "Next" button at any point during the wizard process.
     * (default: false)
     */
    @Input() public canProceed = false;
    /**
     * Set to true to show the "Finish" button at any point during the wizard process.
     * (default: false)
     */
    @Input() public canFinish = false;
    /**
     * Overrides the default text on the finish step button.
     * (default: 'Action')
     */
    @Input() public finishText = DashwizComponent.placeholderFinishText;
    /**
     * Use this to stretch lines between step labels according to largest label width.
     * (default: false)
     */
    @Input() public stretchStepLines: boolean = false;
    /**
     * Optional components to use for the buttons for each step
     */
    @Input() public buttonComponentTypes: string[];
    /**
     * Evaluated when a step is selected.
     */
    @Output() public stepNavigated = new EventEmitter<IDashwizStepNavigatedEvent>();
    /**
     * Evaluated when the user attempts to cancel the wizard.
     */
    @Output() public cancel = new EventEmitter<boolean>();
    /**
     * Evaluated when the user completes the wizard.
     */
    @Output() public finish = new EventEmitter();
    /**
     * Emits when next button is clicked.
     */
    @Output() public next = new EventEmitter();
    /**
     * Emits when Back button is clicked.
     */
    @Output() public back = new EventEmitter();
    /**
     * Use this BehaviorSubject to control navigability between steps
     */
    @Input() public navigationControl: BehaviorSubject<IDashwizWaitEvent> = new BehaviorSubject<IDashwizWaitEvent>({
        busyState: { busy: false },
        allowStepChange: true,
    });

    public currentStep: DashwizStepComponent;
    public stepLineWidth: number = 65;
    public stepIndex: number;
    public buttonProperties: IDashwizButtonsComponent;

    private stepNavigatedEvent: IDashwizStepNavigatedEvent;
    private previousStepIndex = 0;
    private futureStep?: DashwizStepComponent;

    private arraySteps: any[];

    constructor(private changeDetector: ChangeDetectorRef,
                private componentFactoryResolver: ComponentFactoryResolver,
                private logger: LoggerService,
                private dashwizService: DashwizService) {
        if (dashwizService) {
            dashwizService.component = this;
        }
    }

    ngOnInit() {
        this.buttonComponentTypes = this.buttonComponentTypes || [DashwizButtonsComponent.lateLoadKey];

        if (this.finishText === DashwizComponent.placeholderFinishText) {
            this.logger.warn(`DashwizComponent input "finishText" is using placeholder text
"${ DashwizComponent.placeholderFinishText }". A value should be specified.`);
        }
    }

    public ngDoCheck() {
        if (this.currentStep) {
            this.buttonProperties = {
                busy: this.currentStep.busyConfig.busy,
                canProceed: this.canProceed,
                canFinish: this.canFinish,
                isLastStepActive: this.steps.last.active,
                isFirstStepActive: this.steps.first.active,
                nextText: this.currentStep.nextText,
                finishText: this.finishText,
            };
        }
    }

    public ngAfterContentInit() {
        const activeTabs = this.steps.filter((item) => item.active);
        this.arraySteps = this.steps.toArray();
        if (activeTabs.length === 0) {
            this.currentStep = this.steps.first;
            this.selectStep(this.currentStep);
            this.changeDetector.detectChanges();
        }

        this.steps.toArray().forEach((step: DashwizStepComponent) => {
            step.valid.subscribe((event: any) => {
                if (!isUndefined(event)) {
                    this.handleStepControl(step);
                }
            });
        });

        this.navigationControl.subscribe((value: { busyState: IBusyConfig; allowStepChange: any; }) => {
            this.currentStep.busyConfig = value.busyState;
            if (value.allowStepChange && !isUndefined(this.futureStep) && this.currentStep !== this.futureStep) {
                this.enterAnotherStep();
                this.futureStep = undefined;
            }
        });
    }

    public ngAfterViewChecked() {
        if (this.stretchStepLines) {
            this.stepLineWidth = Math.round(this.getLargestLabelWidth() / 2);
            this.changeDetector.detectChanges();
        }
    }

    public ngOnDestroy() {
        this.steps.toArray().forEach((step: DashwizStepComponent) => step.valid.unsubscribe());
        this.navigationControl.unsubscribe();
        this.dashwizService.component = undefined;
    }

    public addStepDynamic(wizardStep: IDashwizStepComponent, indexToInsert: number) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DashwizStepComponent);
        const componentRef = this.dynamicStep.createComponent(componentFactory);
        const instance: IDashwizStepComponent = componentRef.instance;
        instance.stepTemplate = wizardStep.stepTemplate;
        this.arraySteps.splice(indexToInsert, 0, componentRef.instance);
        this.steps.reset(this.arraySteps);
        return componentRef.instance;
    }

    public disableStep(step: DashwizStepComponent) {
        const indexOfStep = this.arraySteps.indexOf(step);
        const toDisable = this.arraySteps[indexOfStep];
        toDisable.disabled = true;
        this.changeDetector.detectChanges();
    }

    public enableStep(step: DashwizStepComponent) {
        const indexOfStep = this.arraySteps.indexOf(step);
        const toDisable = this.arraySteps[indexOfStep];
        toDisable.disabled = false;
        this.changeDetector.detectChanges();
    }

    public hideStep(step: DashwizStepComponent) {
        const indexOfStep = this.arraySteps.indexOf(step);
        const toHide = this.arraySteps[indexOfStep];
        toHide.hidden = true;
    }

    public showStep(step: DashwizStepComponent) {
        const indexOfStep = this.arraySteps.indexOf(step);
        const visibleStep = this.arraySteps[indexOfStep];
        visibleStep.hidden = false;
    }

    public goToStep(stepIndex: number) {
        this.selectStep(this.arraySteps[stepIndex]);
    }

    public selectStep(step: DashwizStepComponent) {
        if (!step.disabled) {
            this.futureStep = step;
            this.currentStep.exitStep({
                currentStepIndex: this.arraySteps.indexOf(this.futureStep),
                currentStep: this.futureStep,
                previousStep: this.arraySteps[this.stepIndex],
                previousStepIndex: this.stepIndex,
            });
            if (this.navigationControl.value.allowStepChange) {
                this.enterAnotherStep();
            }
        }
    }

    public onBack = () => {
        if (!isUndefined(this.stepIndex)) {
            let previousStep = this.arraySteps[this.stepIndex - 1];
            if (previousStep.hidden || previousStep.disabled) {
                previousStep = find(this.arraySteps.slice(0).reverse(),
                    step => !step.hidden,
                    findIndex(this.arraySteps.slice(0).reverse(), this.arraySteps[this.stepIndex]) + 1);
            }
            this.selectStep(previousStep);
            this.back.emit();
        }
    }

    public onNext = () => {
        let nextStep = this.arraySteps[this.stepIndex + 1];
        this.handleStepControl(this.currentStep);
        this.currentStep.nextStep({
            currentStepIndex: this.stepIndex,
            currentStep: this.currentStep,
            previousStep: this.currentStep,
            previousStepIndex: this.stepIndex,
        });
        if (nextStep.hidden || nextStep.disabled && !isUndefined(nextStep.stepControl)) {
            // this disabled does not let user to go forward when next is disabled. Needs to be changed after validation
            nextStep = find(this.arraySteps, step => !step.hidden, this.stepIndex + 1);
        }
        if (isUndefined(this.currentStep.stepControl) || this.currentStep.stepControl) {
            this.currentStep.complete = true;
        }
        if (nextStep.disabled && !nextStep.visited) {
            this.currentStep.complete = false;
        }
        this.selectStep(nextStep);
        this.next.emit();
    }

    public onFinish = () => {
        this.finish.emit();
    }

    public onCancel = () => {
        this.cancel.emit(this.steps.toArray().filter(step => step.complete).length !== 0);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    public buttonPortalActionMap: Record<string, Function> = {
        cancel: this.onCancel,
        next: this.onNext,
        back: this.onBack,
        finish: this.onFinish,
    };

    public enterAnotherStep() {
        this.currentStep.applyExitingStep();
        this.futureStep?.enterStep();

        if (this.futureStep) {
            this.currentStep = this.futureStep;
        }

        this.currentStep.applyEnteringStep();
        this.stepIndex = this.arraySteps.indexOf(this.currentStep);
        this.stepNavigatedEvent = {
            currentStepIndex: this.stepIndex,
            currentStep: this.currentStep,
            previousStep: this.arraySteps[this.previousStepIndex],
            previousStepIndex: this.previousStepIndex,
        };
        this.stepNavigated.emit(this.stepNavigatedEvent);
        this.previousStepIndex = this.stepIndex;
    }

    public onButtonPortalOutput(event: IEvent) {
        // @ts-ignore
        this.buttonPortalActionMap[event.id]?.();
    }

    private disableFollowingSteps(): void {
        this.arraySteps.slice(this.stepIndex + 1).map((item) => {
            item.disabled = true;
        });
    }

    private enableFollowingSteps(): void {
        this.arraySteps.slice(this.stepIndex + 1).map((item) => {
            item.disabled = false;
        });
    }

    private handleStepControl(step: DashwizStepComponent) {
        if (!isUndefined(step.stepControl)) {
            if (step.stepControl) {
                this.enableFollowingSteps();
            } else {
                this.disableFollowingSteps();
            }
        }
    }

    private getLargestLabelWidth() {
        const widths = this.stepTitles.map((title) => title.nativeElement.offsetWidth);

        return Math.round(Math.max(...widths));
    }
}
