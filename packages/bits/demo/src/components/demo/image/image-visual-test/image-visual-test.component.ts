import { Component, Inject } from "@angular/core";
import { IImagesPresetItem, imagesPresetToken } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-image-visual-test",
    templateUrl: "./image-visual-test.component.html",
})
export class ImageVisualTestComponent {
    constructor(@Inject(imagesPresetToken) public images: Array<IImagesPresetItem>) {
    }
}
