import { Component } from "@angular/core";

/** @ignore */
@Component({
    template: `<code>
        <pre>Template load error!</pre>
    </code>`,
})
export class TemplateLoadErrorComponent {
    static lateLoadKey = "TemplateLoadErrorComponent";
}
