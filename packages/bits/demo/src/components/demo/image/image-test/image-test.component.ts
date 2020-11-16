import { Component } from "@angular/core";
import { cloudB } from "@solarwinds/nova-images";

@Component({
    selector: "nui-image-test",
    templateUrl: "./image-test.component.html",
})
export class ImageTestComponent {
    public image = cloudB;
    public ok = "ok-robot";
}
