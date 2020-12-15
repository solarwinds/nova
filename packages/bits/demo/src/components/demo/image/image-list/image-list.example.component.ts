import { Component, Inject } from "@angular/core";
import { IImagesPresetItem, imagesPresetToken } from "@nova-ui/bits";

@Component({
    selector: "nui-image-list-example",
    templateUrl: "./image-list.example.component.html",
})

export class ImageListExampleComponent {
    constructor(@Inject(imagesPresetToken) public images: Array<IImagesPresetItem>) {
    }
}
