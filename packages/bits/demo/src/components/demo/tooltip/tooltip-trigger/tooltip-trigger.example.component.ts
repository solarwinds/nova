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

import { Component } from "@angular/core";

import { TooltipDirective } from "@nova-ui/bits";

@Component({
    selector: "nui-tooltip-trigger-example",
    templateUrl: "tooltip-trigger.example.component.html",
})
export class TooltipTriggerExampleComponent {
    public tooltipText = "I am a Tooltip!";
    public isDisabled = false;

    constructor() {}

    public disableTooltip(state: boolean) {
        this.isDisabled = state;
        // We only set the tooltip to a disabled state above to hide the tooltip.
        // Now we want to enable it back, so it works with the click event.
        setTimeout(() => (this.isDisabled = !state), 0);
    }

    public handleClick(event: MouseEvent, tooltip: TooltipDirective) {
        event.stopPropagation();
        tooltip.show();
    }
}
