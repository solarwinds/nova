import { Component } from "@angular/core";
import { cloudB } from "@solarwinds/nova-images";

@Component({
    selector: "nui-image-width-height-autofill-example",
    templateUrl: "./image-width-height-and-autoFill.example.component.html",
    styleUrls: ["image-width-height-and-autoFill.example.component.less"],
})

export class ImageWidthHeightAndAutoFillExampleComponent {
    public image = cloudB;
    public ok = "ok-robot";
    public robot404 = "404-robot";
    public robot500 = "500-robot";
}
