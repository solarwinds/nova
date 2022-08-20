import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
} from "@angular/core";

import { ILinkDefinition } from "../../../../../components/types";
import { IHasChangeDetector } from "../../../../../types";

@Component({
    selector: "nui-info-message-configuration",
    templateUrl: "./info-message-configuration.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoMessageConfigurationComponent implements IHasChangeDetector {
    public static lateLoadKey = "InfoMessageConfigurationComponent";

    @Input() emphasizeText: string;
    @Input() generalText: string;
    @Input() link: ILinkDefinition;
    @Input() allowDismiss: boolean;

    constructor(public changeDetector: ChangeDetectorRef) {}
}
