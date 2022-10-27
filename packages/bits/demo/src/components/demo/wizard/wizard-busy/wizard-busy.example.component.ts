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

import { Component, ViewChild } from "@angular/core";

import { IBusyConfig, WizardComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-busy-example",
    templateUrl: "./wizard-busy.example.component.html",
})
export class WizardBusyExampleComponent {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;

    public isBusy = false;

    public busyConfig: IBusyConfig = {
        busy: false,
        message: $localize`Step is busy`,
    };

    constructor() {}

    public toggleStepBusy() {
        /* Switch off spinner of all content. Just to avoid two spinners */
        this.isBusy = false;
        this.busyConfig.busy = !this.busyConfig.busy;
        this.wizardComponent.navigationControl.next({
            busyState: this.busyConfig,
            allowStepChange: !this.busyConfig.busy,
        });
    }

    public toggleBusy(): void {
        /* Switch off spinner of step content. Just to avoid two spinners */
        this.busyConfig.busy = false;
        this.isBusy = !this.isBusy;
    }
}
