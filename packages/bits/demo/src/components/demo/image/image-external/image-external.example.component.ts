import { Component } from "@angular/core";
import { cloudB } from "@solarwinds/nova-images";

@Component({
    selector: "nui-image-external-example",
    templateUrl: "./image-external.example.component.html",
})

export class ImageExternalExampleComponent {
    public image = cloudB;
}
