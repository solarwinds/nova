import { DOCUMENT } from "@angular/common";
import { Directive, EventEmitter, HostListener, Inject, Input, OnInit, Output } from "@angular/core";
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
    // tslint:disable:no-input-rename
    /**
     * Text to be copied to the clipboard
     */
    @Input("nuiClipboard") public textToCopy: string;
    // tslint:enable:no-input-rename

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
            return this.logger.error("document copy operation is not supported");
        }
    }

    constructor(private logger: LoggerService,
                @Inject(DOCUMENT) private document: Document) {}

    public ngOnInit(): void {
        try {
            this.hasCopySupport = this.document.queryCommandSupported("copy");
        } catch (ex) {
            this.logger.error(ex.message);
        }
    }

    private copyText(): void {
        if (isEmpty(this.textToCopy) || !isString(this.textToCopy)) {
            return this.logger.warn("notext", "nuiClipboard text is empty or not a string");
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
    }
}
