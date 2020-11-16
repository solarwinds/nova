import {Component, Inject} from "@angular/core";
import {DialogService, NuiDialogRef} from "@solarwinds/nova-bits";

import {InlineWizardDemoComponent} from "./inline-wizard-demo.component";

@Component({
  selector: "rd-demo-wizard",
  templateUrl: "./demo-wizard.component.html",
})

export class DemoWizardComponent {

  public activeDialog: NuiDialogRef;

  constructor(@Inject(DialogService) private dialogService: DialogService) {
  }

  public openDialog() {
    this.activeDialog = this.dialogService.open(InlineWizardDemoComponent, {size: "lg"});
  }

}
