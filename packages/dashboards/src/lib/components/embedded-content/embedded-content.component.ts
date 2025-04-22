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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    OnChanges,
    OnInit,
    SecurityContext,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

import { IHasChangeDetector } from "../../types";
import { EmbeddedContentMode } from "../types";

/* @dynamic */
@Component({
    selector: "nui-embedded-content",
    template: `<div style="width: 100%; height: 100%" #anchor></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class EmbeddedContentComponent
    implements IHasChangeDetector, OnInit, OnChanges
{
    public static lateLoadKey = "EmbeddedContentComponent";

    @Input() public mode: EmbeddedContentMode;
    @Input() public customEmbeddedContent: string;
    @Input() public sanitized: boolean = true;

    @Input() @HostBinding("class") public elementClass = "";

    @ViewChild("anchor", { static: true }) anchor: ElementRef;

    constructor(
        public changeDetector: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document,
        private domSanitizer: DomSanitizer
    ) {}

    public ngOnInit(): void {
        this.validateAndApplyEmbeddedContent();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.customEmbeddedContent &&
            !changes.customEmbeddedContent.firstChange
        ) {
            this.validateAndApplyEmbeddedContent();
        }
    }

    private validateAndApplyEmbeddedContent() {
        const context =
            this.sanitized &&
            this.sanitizeContext(
                this.mode === EmbeddedContentMode.URL
                    ? SecurityContext.URL
                    : SecurityContext.HTML
            );

        this.anchor.nativeElement.innerHTML = "";

        if (this.mode === EmbeddedContentMode.URL) {
            const iframe = this.document.createElement("iframe");
            iframe.src = (
                this.sanitized ? context : this.customEmbeddedContent
            ) as string;
            iframe.width = "100%";
            iframe.height = "100%";

            this.anchor.nativeElement.appendChild(iframe);
        } else {
            this.anchor.nativeElement.innerHTML = this.sanitized
                ? context
                : this.customEmbeddedContent;
        }
    }

    private sanitizeContext(
        securityContextValue: SecurityContext
    ): string | null {
        return this.domSanitizer.sanitize(
            securityContextValue,
            this.customEmbeddedContent?.trim()
        );
    }
}
