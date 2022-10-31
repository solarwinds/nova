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

import { DOCUMENT } from "@angular/common";
import {
    Directive,
    EventEmitter,
    HostListener,
    Inject,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import isString from "lodash/isString";

import { LoggerService } from "../../../services/log-service";

/**
 * <example-url>./../examples/index.html#/common/clipboard</example-url>
 */

/**
 * @ignore
 * @dynamic
 * Directive that provides copy to clipboard functionality.
 */
@Directive({
    selector: "[nuiClipboard]",
})
export class ClipboardDirective implements OnInit {
    /* eslint-disable @angular-eslint/no-input-rename */
    /**
     * Text to be copied to the clipboard
     */
    @Input("nuiClipboard") public textToCopy: string;
    /* eslint-enable @angular-eslint/no-input-rename */

    /**
     * Event that is fired when text was copied to the clipboard successfully
     */
    @Output() public clipboardSuccess = new EventEmitter<void>();
    /**
     * Event that is fired when copy text was failed
     */
    @Output() public clipboardError = new EventEmitter<void>();

    private hasCopySupport = false;

    /**
     * Replaces element click behavior with clipboard copy event
     */
    @HostListener("click", ["$event"])
    public onClick(e: Event): void {
        if (isEqual(this.hasCopySupport, true)) {
            e.preventDefault();
            return this.copyText();
        } else {
            this.clipboardError.emit();
            return this.logger.error(
                "document copy operation is not supported"
            );
        }
    }

    constructor(
        private logger: LoggerService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    public ngOnInit(): void {
        try {
            this.hasCopySupport = this.document.queryCommandSupported("copy");
        } catch (ex) {
            this.logger.error(ex.message);
        }
    }

    private copyText(): void {
        if (isEmpty(this.textToCopy) || !isString(this.textToCopy)) {
            return this.logger.warn(
                "notext",
                "nuiClipboard text is empty or not a string"
            );
        }

        const node = this.createNode(this.textToCopy);

        try {
            const selection = this.document.getSelection();
            this.document.body.appendChild(node);
            node.select();
            this.document.execCommand("copy");
            selection?.removeAllRanges();
            this.clipboardSuccess.emit();
        } catch (ex) {
            this.logger.error(ex.message);
            this.clipboardError.emit();
        } finally {
            this.document.body.removeChild(node);
        }
    }

    private createNode = (text: string): HTMLTextAreaElement => {
        const node = this.document.createElement("textarea");

        node.style.position = "absolute";
        node.style.left = "-10000px";
        node.textContent = text;

        return node;
    };
}
