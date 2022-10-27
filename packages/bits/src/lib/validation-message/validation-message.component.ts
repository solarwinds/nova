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

import { Component, Input, ViewEncapsulation } from "@angular/core";
/** @ignore */
@Component({
    selector: "nui-validation-message",
    templateUrl: "./validation-message.component.html",
    styleUrls: ["./validation-message.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: { role: "alert" },
})
export class ValidationMessageComponent {
    /**
     * Optional manual control of message visibility.
     * This allows the form field to manually hide and show the message if needed.
     * Typically, visibility is determined automatically by the validator specified in the "for" input.
     * @type {boolean}
     */
    @Input() public show = false;
    /**
     * Pass the validator name to this input to allow the validator to control the visibility
     * of the message based on the validation state of the associated form field.
     * @type {string}
     */
    @Input() public for: string;
}
