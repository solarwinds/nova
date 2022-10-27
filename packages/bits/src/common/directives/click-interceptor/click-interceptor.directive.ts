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

import { Directive, HostListener } from "@angular/core";

import { DOCUMENT_CLICK_EVENT } from "../../../constants/event.constants";
import { EventBusService } from "../../../services/event-bus.service";

/**
 *
 * <h4>Required Modules</h4>
 *  <ul>
 *   <li>
 *      <code>NuiCommonModule</code>
 *   </li>
 *  </ul>
 *
 */

@Directive({
    selector: "[nuiClickInterceptor]",
})
export class ClickInterceptorDirective {
    @HostListener("click", ["$event"])
    catchClick(event: MouseEvent) {
        event.stopPropagation();
        this.eventBusService
            .getStream({ id: DOCUMENT_CLICK_EVENT })
            .next(event);
    }

    constructor(private eventBusService: EventBusService) {}
}
