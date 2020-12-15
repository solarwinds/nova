import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { LoggerService } from "@nova-ui/bits";

import { FormatterConfiguratorComponent } from "../formatter-configurator.component";

/** @ignore */
@Component({
    selector: "nui-value-selector",
    templateUrl: "./value-selector.component.html",
})
export class ValueSelectorComponent extends FormatterConfiguratorComponent {
    static lateLoadKey = "ValueSelectorComponent";

    constructor(changeDetector: ChangeDetectorRef, formBuilder: FormBuilder, logger: LoggerService) {
        super(changeDetector, formBuilder, logger);
    }
}
