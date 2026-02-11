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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewEncapsulation,
    afterNextRender,
    computed,
    effect,
    inject,
    input,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

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
    standalone: true,
    templateUrl: "./image.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./image.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[attr.role]": "computedRole()",
        "[attr.aria-hidden]": "computedAriaHidden()",
        "[attr.aria-label]": "computedAriaLabel()",
    },
})
export class ImageComponent {
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
    /**
     * Optional ARIA role override. Constrained to 'img' | 'presentation' | null.
     * If omitted, role is inferred from presence of alt/label.
     */
    public role = input<"img" | "presentation" | null>();

    public imageName = computed<string | null>(() => {
        const img = this.image();
        if (img && typeof img === "object" && "name" in img) {
            return (img as any).name ?? null;
        }
        const fromPreset = this.getImage(img as string);
        return fromPreset?.name ?? null;
    });

    public hasAlt = computed<boolean>(() => {
        const img = this.image();
        const hasCode = !!(img && typeof img === "object" && typeof (img as any).code === "string");
        return !hasCode;
    });

    public imageTemplate = computed<SafeHtml>(() => {
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

    private a11y = computed(() =>
        computeA11yForGraphic({
            decorative: false,
            explicitRole: this.role(),
            label: this.description() || this.imageName() || null,
            hasAlt: this.hasAlt(),
            statusParts: undefined,
        })
    );

    private logger = inject(LoggerService);
    private utilService = inject(UtilService);
    private changeDetector = inject(ChangeDetectorRef);
    private images = inject<Array<IImagesPresetItem>>(imagesPresetToken);
    private domSanitizer = inject(DomSanitizer);
    private el = inject(ElementRef);

    public computedRole = computed(() => this.a11y().role);
    public computedAriaHidden = computed(() => this.a11y().ariaHidden);
    public computedAriaLabel = computed(() => this.a11y().ariaLabel);

    constructor() {
        effect(() => {
            const h = this.height();
            const w = this.width();
            [h, w].forEach((item) => {
                if (item !== undefined && !this.isImageSizeValid(item)) {
                    this.logger.error(
                        "Image size should be specified in 'px', '%', or 'auto"
                    );
                }
            });
        });

        afterNextRender(() => {
            if (this.autoFill()) {
                const svg = this.el.nativeElement.querySelector("svg");
                if (svg) {
                    svg.setAttribute("width", "100%");
                    svg.setAttribute("height", "100%");
                } else {
                    console.warn(
                        "Can't apply 'autoFill' to nui-image, because it is only applicable to SVG type of images"
                    );
                }
            }

            // Fix bug for Safari with wrong alignment of floated SVG images
            if (this.float() && !this.width() && this.utilService.browser?.isSafari()) {
                const svg = this.el.nativeElement.querySelector("svg");
                if (svg) {
                    (this.el.nativeElement as HTMLElement).style.width = svg.width.baseVal.value + "px";
                    this.changeDetector.detectChanges();
                }
            }
        });
    }

    private getImage = (imageName: string): IImagesPresetItem | undefined =>
        this.images.find((img) => img.name === imageName);

    private isImageSizeValid(value: string): boolean {
        return (
            !isNaN(parseFloat(value)) &&
            (value.includes("px") || value.includes("%") || value.includes("auto"))
        );
    }
}
