import { animate, state, style, transition, trigger } from "@angular/animations";
import { ChangeDetectorRef, Component, Input } from "@angular/core";

import { IHasChangeDetector } from "../../types";

@Component({
    selector: "nui-loading",
    templateUrl: "./loading.component.html",
    styleUrls: ["./loading.component.less"],
    animations: [
        trigger("animate", [
            state("true", style({ opacity: 1 })),
            state("false", style({ opacity: 0 })),
            transition("false <=> true", animate(500)),
        ]),
    ],
})
export class LoadingComponent implements IHasChangeDetector {
    static lateLoadKey = "LoadingComponent";

    @Input() public active = false;

    constructor(public changeDetector: ChangeDetectorRef) {
    }

}
