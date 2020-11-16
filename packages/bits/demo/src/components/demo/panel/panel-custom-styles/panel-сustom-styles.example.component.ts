import { Component } from "@angular/core";
import { PanelBackgroundColor } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-panel-custom-styles-example",
    templateUrl: "./panel-custom-styles.example.component.html",
})

export class PanelCustomStylesExampleComponent {
    constructor() {
    }
    public panelColor: PanelBackgroundColor = PanelBackgroundColor.colorBgSecondary;
    public heading = $localize `No Padding Header`;
}
