import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SecurityContext } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { Converter } from "showdown";

import { IPost } from "../types";

@Component({
    selector: "rd-post-form",
    templateUrl: "./post-form.component.html",
    styleUrls: ["./post-form.component.less"],
})
export class PostFormComponent implements OnInit, OnDestroy {

    @Output() formReady = new EventEmitter<FormGroup>();
    @Input() public post: IPost = <any>{ text: null, author: null };

    public postForm: FormGroup;
    public preview: string;

    private converter = new Converter();
    private textSubscription: Subscription;

    constructor(private formBuilder: FormBuilder, private domSanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.postForm = this.formBuilder.group({
            text: this.formBuilder.control(this.post.text, Validators.required),
            author: this.formBuilder.control(this.post.author, Validators.required),
        });

        this.textSubscription = this.postForm.controls["text"].valueChanges.subscribe((value) => {
            this.updatePreview(value);
        });

        this.updatePreview(this.post.text);

        this.formReady.emit(this.postForm);
    }

    ngOnDestroy(): void {
        if (this.textSubscription) {
            this.textSubscription.unsubscribe();
        }
    }

    public updatePreview(markdown: string) {
        this.preview = this.domSanitizer.sanitize(SecurityContext.HTML, this.converter.makeHtml(markdown));
    }
}
