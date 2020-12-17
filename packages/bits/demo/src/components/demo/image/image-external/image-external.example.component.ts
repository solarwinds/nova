import { Component } from "@angular/core";
import { IImagesPresetItem } from "@nova-ui/bits";

@Component({
    selector: "nui-image-external-example",
    templateUrl: "./image-external.example.component.html",
})

export class ImageExternalExampleComponent {
    public bookCoverUrl = "https://imgc.allpostersimages.com/img/print/u-g-F8PQ9I0.jpg?w=550&h=550&p=0";

    public imageObject: IImagesPresetItem = {
        "svgFile": "watermark-data.svg",
        "name": "no-data-to-show",
        "brushType": "filled",
        "code": "<svg width='169.5' height='116.09' viewBox='0 0 169.5 116.09'><defs><style>.nui-image-watermark-data-1,.nui-image-watermark-data-2{fill:#707070;}.nui-image-watermark-data-1{fill-opacity:0.2;}.nui-image-watermark-data-2{fill-opacity:0.2;}.nui-image-watermark-data-3,.nui-image-watermark-data-6{fill:#fff;}.nui-image-watermark-data-3,.nui-image-watermark-data-5,.nui-image-watermark-data-6{stroke:#707070;}.nui-image-watermark-data-3,.nui-image-watermark-data-5{stroke-linecap:round;stroke-linejoin:round;}.nui-image-watermark-data-4{fill:#d5d5d5;}.nui-image-watermark-data-5{fill:none;}.nui-image-watermark-data-6{stroke-miterlimit:10;}</style></defs><title>empty-data</title><g id='empty-data'><path class='nui-image-watermark-data-1' d='M169.5,62.09c0-5-12.31-9-27.5-9s-27.5,4-27.5,9v45c0,5,12.31,9,27.5,9s27.5-4,27.5-9Z'/><polygon class='nui-image-watermark-data-2' points='144 24.47 93.77 5 74.5 12.47 124.73 31.94 144 24.47'/><polygon class='nui-image-watermark-data-2' points='55.23 5 5 24.47 24.27 31.94 74.5 12.47 55.23 5'/><polygon class='nui-image-watermark-data-2' points='124.73 31.94 124.5 32.03 124.5 31.85 74.5 12.47 24.5 31.85 24.5 32.03 24.27 31.94 5 39.41 24.5 46.97 24.5 78.88 74.5 98.26 124.5 78.88 124.5 46.97 144 39.41 124.73 31.94'/><polygon class='nui-image-watermark-data-3' points='120 27.44 120 74.38 70 93.76 20 74.38 20 27.44 70 7.97 120 27.44'/><polygon class='nui-image-watermark-data-4' points='70 7.97 120 27.44 70 46.76 20 27.44 70 7.97'/><line class='nui-image-watermark-data-5' x1='70' y1='93.59' x2='70' y2='8.18'/><polygon class='nui-image-watermark-data-3' points='70 7.97 120.23 27.44 139.5 19.97 89.27 0.5 70 7.97'/><polygon class='nui-image-watermark-data-3' points='70 7.97 19.77 27.44 0.5 19.97 50.73 0.5 70 7.97'/><polygon class='nui-image-watermark-data-3' points='70 46.91 120.23 27.44 139.5 34.91 89.27 54.38 70 46.91'/><polygon class='nui-image-watermark-data-3' points='70 46.91 19.77 27.44 0.5 34.91 50.73 54.38 70 46.91'/><path class='nui-image-watermark-data-6' d='M137.5,78.59c-15.19,0-27.5,4-27.5,9v15c0,5,12.31,9,27.5,9s27.5-4,27.5-9v-15C165,82.62,152.69,78.59,137.5,78.59Z'/><ellipse class='nui-image-watermark-data-6' cx='137.5' cy='87.59' rx='27.5' ry='9'/><path class='nui-image-watermark-data-6' d='M137.5,63.59c-15.19,0-27.5,4-27.5,9v15c0,5,12.31,9,27.5,9s27.5-4,27.5-9v-15C165,67.62,152.69,63.59,137.5,63.59Z'/><ellipse class='nui-image-watermark-data-6' cx='137.5' cy='72.59' rx='27.5' ry='9'/><path class='nui-image-watermark-data-6' d='M137.5,48.59c-15.19,0-27.5,4-27.5,9v15c0,5,12.31,9,27.5,9s27.5-4,27.5-9v-15C165,52.62,152.69,48.59,137.5,48.59Z'/><ellipse class='nui-image-watermark-data-6' cx='137.5' cy='57.59' rx='27.5' ry='9'/></g></svg>",
    };

}
