import { Component, Inject, Input } from "@angular/core";

import { IToastService } from "../../toast/public-api";
import { ToastService } from "../../toast/toast.service";

/** @ignore */
@Component({
    templateUrl: "./copy-text.component.html",
    selector: "nui-copy-text",
    styleUrls: ["./copy-text.component.less"],
})
export class CopyTextComponent {
    // file to which the copy applies
    @Input()
    public fileContent: string;
    public copyTooltip = $localize`copy snippet to clipboard`;

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    public onSnippetCopied() {
        this.toastService.info({
            message: $localize`Code snippet copied to clipboard`,
            options: {
                timeOut: 2000,
                extendedTimeOut: 1000,
            },
        });
    }
}
