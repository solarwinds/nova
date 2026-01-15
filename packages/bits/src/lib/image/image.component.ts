// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    ViewEncapsulation,
    computed,
    effect,
    input,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import _find from "lodash/find";
import _includes from "lodash/includes";
import _isEqual from "lodash/isEqual";
import _isNumber from "lodash/isNumber";
import _isUndefined from "lodash/isUndefined";

import { IImagesPresetItem } from "./public-api";
import { imagesPresetToken } from "../../constants/images.constants";
import { computeA11yForGraphic } from "../../functions/a11y-graphics.util";
import { LoggerService } from "../../services/log-service";
import { UtilService } from "../../services/util.service";

/**
 * <example-url>./../examples/index.html#/image</example-url>
 */
@Component({
    selector: "nui-image",
    templateUrl: "./image.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./image.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[attr.role]": "computedRole",
        "[attr.aria-hidden]": "computedAriaHidden",
        "[attr.aria-label]": "computedAriaLabel",
    },
})
export class ImageComponent implements AfterViewInit {
    /**
     * Image name from nui image preset or external source
     */
    public image = input<any>();

    /**
     * Sets aria-label text or alt for image from external source
     */
    public description = input<string>();

    /**
     * Available values are: 'left' and 'right'
     */
    public float = input<string>();
    /**
     * Available values are: 'centered', 'small', 'large'
     */
    public margin = input<string>();
    /**
     * 'True' will apply 30% opacity to the image
     */
    public isWatermark = input<boolean>();
    /**
     * Sets the width of the container parent image
     */
    public width = input<string>("auto");
    /**
     * Sets the height of the container parent image
     */
    public height = input<string>("auto");
    /**
     * When set to true sets the hardcoded width and height of the svg to 100% to fill the parent container
     */
    public autoFill = input<boolean>();

    private imageNameSignal = computed<string | null>(() => {
        const img = this.image();
        if (img && typeof img === "object" && "name" in img) {
            return (img as any).name ?? null;
        }
        const fromPreset = this.getImage(img as string);
        return fromPreset?.name ?? null;
    });

    private hasAltSignal = computed<boolean>(() => {
        const img = this.image();
        const hasCode = !!(img && typeof img === "object" && typeof (img as any).code === "string");
        return !hasCode;
    });

    private a11y = computed(() =>
        computeA11yForGraphic({
            decorative: false,
            explicitRole: this.role(),
            label: this.description() || this.imageNameSignal() || null,
            hasAlt: this.hasAltSignal(),
            statusParts: undefined,
        })
    );

    private imageTemplateSignal = computed<SafeHtml>(() => {
        const img = this.image();
        let html = "";
        if (img && typeof img === "object" && typeof (img as any).code === "string") {
            html = (img as any).code;
        } else if (typeof img === "string") {
            const fromPreset = this.getImage(img);
            if (fromPreset?.code) {
                html = fromPreset.code;
            } else {
                html = `<img src="${img}" alt="${this.description()}">`;
            }
        }
        return this.domSanitizer.bypassSecurityTrustHtml(html);
    });

    public get imageTemplate(): SafeHtml {
        return this.imageTemplateSignal();
    }

    public get imageName(): string | null {
        return this.imageNameSignal();
    }

    public get hasAlt(): boolean {
        return this.hasAltSignal();
    }

    /**
     * Optional ARIA role override. Constrained to 'img' | 'presentation' | null.
     * If omitted, role is inferred from presence of alt/label.
     */
    public role = input<"img" | "presentation" | null>();

    constructor(
        private logger: LoggerService,
        private utilService: UtilService,
        private changeDetector: ChangeDetectorRef,
        @Inject(imagesPresetToken) private images: Array<IImagesPresetItem>,
        private domSanitizer: DomSanitizer,
        private el: ElementRef
    ) {
        effect(() => {
            const h = this.height();
            const w = this.width();
            const dimensionInputs: Array<string | undefined> = [h, w];
            dimensionInputs.forEach((item) => {
                if (!_isUndefined(item) && !this.isImageSizeValid(item as string)) {
                    this.logger.error(
                        "Image size should be specified in 'px', '%', or 'auto"
                    );
                }
            });
        });
    }

    public get computedRole(): string | null {
        return this.a11y().role;
    }
    public get computedAriaHidden(): string | null {
        return this.a11y().ariaHidden;
    }
    public get computedAriaLabel(): string | null {
        return this.a11y().ariaLabel;
    }

    public ngAfterViewInit(): void {
        if (this.autoFill()) {
            try {
                const svg = this.el.nativeElement.querySelector("svg");
                svg.setAttribute("width", "100%");
                svg.setAttribute("height", "100%");
            } catch {
                console.warn(
                    "Can't apply 'autoFill' to nui-image, because it is only applicable to SVG type of images"
                );
                return;
            }
        }

        /**
         * Fix bug for Safari with wrong alignment of floated SVG images
         */
        if (this.float() && !this.width() && this.utilService.browser?.isSafari()) {
            const svg = this.el.nativeElement.querySelector("svg");

            if (!svg) {
                return;
            }

            // update width input binding via DOM to avoid mutating signal directly here
            (this.el.nativeElement as HTMLElement).style.width = svg.width.baseVal.value + "px";
            this.changeDetector.detectChanges();
        }
    }

    private getImage = (imageName: string): IImagesPresetItem | undefined =>
        _find(this.images, (img: IImagesPresetItem) =>
            _isEqual(img.name, imageName)
        );

    private isImageSizeValid(input: string): boolean {
        return (
            _isNumber(parseFloat(input)) &&
            (_includes(input, "px") ||
                _includes(input, "%") ||
                _includes(input, "auto"))
        );
    }
}
