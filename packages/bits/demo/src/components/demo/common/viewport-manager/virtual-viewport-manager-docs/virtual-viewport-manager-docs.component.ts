import { Component } from "@angular/core";
import { RepeatComponent } from "@solarwinds/nova-bits";

@Component({
  selector: "nui-virtual-viewport-manager-docs",
  templateUrl: "./virtual-viewport-manager-docs.component.html",
})
export class VirtualViewportManagerDocsComponent {
    getRepeatPropKey(key: keyof RepeatComponent): string {
        return key;
    }
}
