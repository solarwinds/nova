import { Component, Inject } from "@angular/core";
import { IImagesPresetItem, imagesPresetToken } from "@solarwinds/nova-bits";
import * as customImages from "@solarwinds/nova-images";

@Component({
    selector: "nui-image-list-example",
    templateUrl: "./image-list.example.component.html",
})

export class ImageListExampleComponent {
    public customImages: Array<IImagesPresetItem> = [];
    constructor(@Inject(imagesPresetToken) public images: Array<IImagesPresetItem>) {
        for (const singleImage of Object.keys(customImages)) {
            this.customImages.push((customImages as any)[singleImage]);
        }
    }
}
