// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
} from "@angular/core";

import { IBusyConfig, SpinnerSize } from "@nova-ui/bits";

import { IDashwizStepComponent, IDashwizStepNavigatedEvent } from "../types";

/**
 * Component that provides wizard step functionality.
 */
@Component({
    selector: "nui-dashwiz-step",
    templateUrl: "./dashwiz-step.component.html",
    styleUrls: ["./dashwiz-step.component.less"],
})
export class DashwizStepComponent
    implements IDashwizStepComponent, OnInit, OnChanges
{
    /**
     * Template for step.
     */
    @Input() public stepTemplate?: TemplateRef<any>;
    /**
     * Check is form inside step valid.
     */
    @Input() public stepControl?: boolean;
    /**
     * The title of the step.
     */
    @Input() public title: string;
    /**
     * Default:'Next'. Text for the Next button.
     */
    @Input() public nextText: string;
    /**
     * Hide step
     */
    @Input() public hidden = false;
    /**
     * Disables step
     */
    @Input() public disabled?: boolean;
    /**
     * The size of the busy spinner
     */
    @Input() public spinnerSize: SpinnerSize = SpinnerSize.Large;
    /**
     * Evaluated when the step is entered.
     */
    @Output() public enter =
        new EventEmitter<IDashwizStepNavigatedEvent | void>();
    /**
     * Evaluated when validity of the step is changed.
     */
    @Output() public valid = new EventEmitter<boolean>();
    /**
     * Evaluated when the step is exited.
     */
    @Output() public exit =
        new EventEmitter<IDashwizStepNavigatedEvent | void>();
    /**
     * Evaluated when trying to go to the next step.
     */
    @Output() public next =
        new EventEmitter<IDashwizStepNavigatedEvent | void>();

    /**
     *
     * Options for busy state. Default: no busy state, with clear empty busy component when set to true
     */
    public busyConfig: IBusyConfig = {
        busy: false,
    };

    public visited = false;
    public active = false;
    public complete = false;
    public icon = "step";
    public iconColor = "";

    constructor() {}

    ngOnInit(): void {
        this.nextText = this.nextText || $localize`Next`;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["stepControl"]) {
            this.valid.emit(this.stepControl);
        }
    }

    /**
     * Set flags for step entering and emits enter event
     */
    public enterStep = (event?: IDashwizStepNavigatedEvent): void => {
        this.enter.emit(event);
    };

    /**
     * Set flags for step exiting and emits exit event
     */
    public exitStep = (event?: IDashwizStepNavigatedEvent): void => {
        this.exit.emit(event);
    };

    public nextStep = (event?: IDashwizStepNavigatedEvent): void => {
        this.next.emit(event);
    };

    public applyEnteringStep = (): void => {
        this.active = true;
        this.icon = "step-active";
        this.iconColor = "black";
    };

    public applyExitingStep = (): void => {
        this.active = false;
        this.visited = true;
        this.icon = "step-complete";
        this.iconColor = "";
    };
}
