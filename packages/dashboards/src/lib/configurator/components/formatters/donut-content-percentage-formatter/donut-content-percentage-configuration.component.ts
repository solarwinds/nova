import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { LoggerService } from "@nova-ui/bits";

import { PizzagnaService } from "../../../../pizzagna/public-api";
import { DonutChartFormatterConfiguratorComponent } from "../widget-formatter-configurators/donut-formatter-configurator.component";

@Component({
    selector: "nui-donut-content-configurator",
    templateUrl: "donut-content-percentage-configuration.component.html",
})

export class DonutContentPercentageConfigurationComponent extends DonutChartFormatterConfiguratorComponent {
    static lateLoadKey = "DonutContentPercentageConfigurationComponent";

    constructor(changeDetector: ChangeDetectorRef, formBuilder: FormBuilder, logger: LoggerService, private pizzagnaService: PizzagnaService) {
        super(changeDetector, formBuilder, logger);
    }
}
