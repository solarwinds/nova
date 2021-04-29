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
})

export class EmbeddedContentComponent implements IHasChangeDetector, OnInit, OnChanges {
    public static lateLoadKey = "EmbeddedContentComponent";

    @Input() public mode: EmbeddedContentMode;
    @Input() public customEmbeddedContent: string;
    @Input() public sanitized: boolean = true;

    @Input() @HostBinding("class") public elementClass = "";

    @ViewChild("anchor", { static: true }) anchor: ElementRef;

    constructor(public changeDetector: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document,
        private domSanitizer: DomSanitizer
    ) { }


    ngOnInit() {
        this.validateAndApplyEmbeddedContent();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.customEmbeddedContent && !changes.customEmbeddedContent.firstChange) {
            this.validateAndApplyEmbeddedContent();
        }
    }

    private validateAndApplyEmbeddedContent() {
        const context = this.sanitized && this.sanitizeContext(this.mode === EmbeddedContentMode.URL ? SecurityContext.URL : SecurityContext.HTML);

        this.anchor.nativeElement.innerHTML = "";

        if (this.mode === EmbeddedContentMode.URL) {
            const iframe = this.document.createElement("iframe");
            iframe.src = (this.sanitized ? context : this.customEmbeddedContent) as string;
            iframe.width = "100%";
            iframe.height = "100%";

            this.anchor.nativeElement.appendChild(iframe);
        } else {
            this.anchor.nativeElement.innerHTML = this.sanitized ? context : this.customEmbeddedContent;
        }
    }

    private sanitizeContext(securityContextValue: SecurityContext): string | null {
        return this.domSanitizer.sanitize(securityContextValue, this.customEmbeddedContent?.trim());
    }
}
