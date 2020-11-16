import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit,
    ViewEncapsulation
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import _find from "lodash/find";
import _has from "lodash/has";
import _includes from "lodash/includes";
import _isEqual from "lodash/isEqual";
import _isNumber from "lodash/isNumber";
import _isString from "lodash/isString";
import _isUndefined from "lodash/isUndefined";

import { imagesPresetToken } from "../../constants/images.constants";
import { LoggerService } from "../../services/log-service";
import { UtilService } from "../../services/util.service";

import { IImagesPresetItem } from "./public-api";
/**
 * <example-url>./../examples/index.html#/image</example-url>
 */

@Component({
    selector: "nui-image",
    templateUrl: "./image.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./image.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class ImageComponent implements OnInit, AfterViewInit {
    /**
     * Image name from nui image preset or image from external repo nova-images
     */
    @Input() public image: any;

    /**
     * Available values are: 'left' and 'right'
     */
    @Input() public float: string;
    /**
     * Available values are: 'centered', 'small', 'large'
     */
    @Input() public margin: string;
    /**
     * 'True' will apply 30% opacity to the image
     */
    @Input() public isWatermark: boolean;
    /**
     * Sets the width of the container parent image
     */
    @Input() public width: string = "auto";
    /**
     * Sets the height of the container parent image
     */
    @Input() public height: string = "auto";
    /**
     * When set to true sets the hardcoded width and height of the svg to 100% to fill the parent container
     */
    @Input() public autoFill: boolean;

    constructor(private logger: LoggerService,
                private utilService: UtilService,
                private changeDetector: ChangeDetectorRef,
                @Inject(imagesPresetToken) private images: Array<IImagesPresetItem>,
                private domSanitizer: DomSanitizer,
                private el: ElementRef) {
    }

    public ngOnInit(): void {
        const dimensionImputs: string[] = [ this.height, this.width ];

        dimensionImputs.forEach(item => {
            if (!_isUndefined(item) && !this.isImageSizeValid(item)) {
                this.logger.error("Image size should be specified in 'px', '%', or 'auto");
            }
        });
    }

    public ngAfterViewInit() {
        if (this.autoFill) {
            try {
                const svg = this.el.nativeElement.querySelector("svg");
                svg.setAttribute("width", "100%");
                svg.setAttribute("height", "100%");
            } catch (e) {
                console.warn("Can't apply 'autoFill' to nui-image, because it is only applicable to SVG type of images");
                return;
            }
        }

        /**
         * Fix bug for Safari with wrong alignment of floated SVG images
         */
        if (this.float && !this.width && this.utilService.browser?.isSafari()) {
            const svg = this.el.nativeElement.querySelector("svg");

            if (!svg) {
                return;
            }

            this.width = svg.width.baseVal.value + "px";
            this.changeDetector.detectChanges();
        }
    }

    public getImageTemplate(): SafeHtml {
        const image = this.image.code ? this.image : this.getImage(this.image);
        let imageHtml: string = "";
        if (_has(image, "code") && _isString(image.code)) {
            imageHtml = image.code;
        } else {
            imageHtml = `<img src="${this.image}">`;
        }

        return this.domSanitizer.bypassSecurityTrustHtml(imageHtml);
    }

    private getImage = (imageName: string): IImagesPresetItem | undefined =>
        _find(this.images, (img: IImagesPresetItem) => _isEqual(img.name, imageName))

    private isImageSizeValid(input: string): boolean {
        return _isNumber(parseFloat(input)) && (_includes(input, "px") || _includes(input, "%") || _includes(input, "auto"));
    }
}
