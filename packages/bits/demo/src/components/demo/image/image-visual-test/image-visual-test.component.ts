import { Component, Inject } from "@angular/core";
import { IImagesPresetItem, imagesPresetToken } from "@solarwinds/nova-bits";
import * as customImages from "@solarwinds/nova-images";

@Component({
    selector: "nui-image-visual-test",
    templateUrl: "./image-visual-test.component.html",
})
export class ImageVisualTestComponent {
    public image = customImages.cloudB;
    public customImages: Array<IImagesPresetItem> = [];

    constructor(@Inject(imagesPresetToken) public images: Array<IImagesPresetItem>) {
        for (const singleImage of Object.keys(customImages)) {
            this.customImages.push((customImages as any)[singleImage]);
        }
    }
}
