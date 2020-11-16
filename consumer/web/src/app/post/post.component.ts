import { Component, Input, OnChanges, SecurityContext, SimpleChanges } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Converter } from "showdown";

import { IPost } from "../types";

@Component({
    selector: "rd-post",
    templateUrl: "./post.component.html",
})
export class PostComponent implements OnChanges {
    @Input() public post: IPost = <any>{};
    @Input() public isQuestion = false;

    public textMarkdown: string;
    private converter = new Converter();

    constructor(private domSanitizer: DomSanitizer) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["post"]) {
            this.updatePreview();
        }
    }

    private updatePreview() {
        this.textMarkdown = this.domSanitizer.sanitize(SecurityContext.HTML, this.converter.makeHtml(this.post.text));
    }
}
