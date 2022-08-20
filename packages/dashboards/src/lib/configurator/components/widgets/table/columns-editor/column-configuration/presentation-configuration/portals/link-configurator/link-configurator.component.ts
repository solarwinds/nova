import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { LoggerService } from "@nova-ui/bits";

import { IHasChangeDetector } from "../../../../../../../../../types";
import { ConfiguratorHeadingService } from "../../../../../../../../services/configurator-heading.service";

import { FormatterConfiguratorComponent } from "../formatter-configurator.component";

@Component({
    selector: "nui-link-configurator",
    templateUrl: "./link-configurator.component.html",
})
export class LinkConfiguratorComponent
    extends FormatterConfiguratorComponent
    implements IHasChangeDetector
{
    public static lateLoadKey = "LinkConfiguratorComponent";

    constructor(
        changeDetector: ChangeDetectorRef,
        configuratorHeading: ConfiguratorHeadingService,
        formBuilder: FormBuilder,
        logger: LoggerService
    ) {
        super(changeDetector, configuratorHeading, formBuilder, logger);
    }

    public initForm(): void {
        const dataFieldForm: Record<string, any> = {
            link: [null, Validators.required],
            value: [null, Validators.required],
        };

        this.form = this.formBuilder.group({
            dataFieldIds: this.formBuilder.group(dataFieldForm),
            targetSelf: [false],
        });

        this.formReady.emit(this.form);
    }
}
