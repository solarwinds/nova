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
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  contentChild
} from "@angular/core";

import { TabNavigationService } from "../../services/tab-navigation.service";
import { ProgressComponent } from "../progress/progress.component";
import { SpinnerComponent } from "../spinner/spinner.component";

/**
 * <example-url>./../examples/index.html#/busy</example-url>
 */
@Component({
    selector: "[nui-busy]",
    templateUrl: "./busy.component.html",
    styleUrls: ["./busy.component.less"],
    providers: [TabNavigationService],
    encapsulation: ViewEncapsulation.None,
    host: { "[attr.aria-busy]": "busy" },
    standalone: false,
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

    readonly spinnerComponent = contentChild.required(SpinnerComponent);
    readonly progressComponent = contentChild.required(ProgressComponent);

    constructor(
        private tabNavigationService: TabNavigationService,
        private elRef: ElementRef
    ) {}

    public ngAfterContentInit(): void {
        this.setBusyStateForContentComponents();

        this.isSpinnerTemplate = Boolean(this.spinnerComponent()()()());
        this.isProgressTemplate = Boolean(this.progressComponent()()()());
        const spinnerComponent = this.spinnerComponent();
        const progressComponent = this.progressComponent();
        const spinnerComponent = this.spinnerComponent();
        const progressComponent = this.progressComponent();
        const spinnerComponent = this.spinnerComponent();
        const progressComponent = this.progressComponent();
        const spinnerComponent = this.spinnerComponent();
        const progressComponent = this.progressComponent();
        if (spinnerComponent && progressComponent) {
            this.isSpinnerTemplate = false;
            this.isProgressTemplate = false;
            this.isDefaultTemplate = true;
        }
        if (!spinnerComponent && !progressComponent) {
            this.isDefaultTemplate = true;
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
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
        const spinnerComponent = this.spinnerComponent();
        const spinnerComponent = this.spinnerComponent();
        const spinnerComponent = this.spinnerComponent();
        const spinnerComponent = this.spinnerComponent();
        if (spinnerComponent) {
            spinnerComponent.showSpinner = this.busy;
        }
        const progressComponent = this.progressComponent();
        const progressComponent = this.progressComponent();
        const progressComponent = this.progressComponent();
        const progressComponent = this.progressComponent();
        if (progressComponent) {
            progressComponent.show = this.busy;
        }
    }
}
