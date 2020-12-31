import {Directive, TemplateRef} from "@angular/core";

@Directive({
  selector: "[wizardStepFooter]",
})
export class WizardStepFooterDirective {
    constructor(public template: TemplateRef<any>) { }
}
