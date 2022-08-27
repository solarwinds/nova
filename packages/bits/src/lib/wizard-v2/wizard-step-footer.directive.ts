import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "[nuiWizardStepFooter]",
})
export class WizardStepFooterDirective {
    constructor(public template: TemplateRef<any>) {}
}
