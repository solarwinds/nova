import {Component, Input, ViewEncapsulation} from "@angular/core";

/**
 * <example-url>./../examples/index.html#/content</example-url>
 */

/** @ignore */
@Component({
    selector: "nui-content",
    templateUrl: "./content.component.html",
    styleUrls: ["./content.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: { "role": "document" },
})
export class ContentComponent {

    @Input() size: "small" | "normal" | "large" = "normal";

    public getMessageClass(): string {
        return "nui-content-" + this.size;
    }

}
