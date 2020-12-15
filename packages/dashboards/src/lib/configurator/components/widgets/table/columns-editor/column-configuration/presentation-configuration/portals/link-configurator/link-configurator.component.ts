import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { LoggerService } from "@nova-ui/bits";

import { FormatterConfiguratorComponent } from "../formatter-configurator.component";

@Component({
    selector: "nui-link-configurator",
    templateUrl: "./link-configurator.component.html",
})
export class LinkConfiguratorComponent extends FormatterConfiguratorComponent {
    static lateLoadKey = "LinkConfiguratorComponent";

    constructor(changeDetector: ChangeDetectorRef, formBuilder: FormBuilder, logger: LoggerService) {
        super(changeDetector, formBuilder, logger);
    }
}
