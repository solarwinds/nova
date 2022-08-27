import { ChangeDetectorRef, ElementRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import _sample from "lodash/sample";

import { LoggerService } from "../../services/log-service";
import { UtilService } from "../../services/util.service";
import { ImageComponent } from "./image.component";
import { IImagesPresetItem } from "./public-api";

describe("components >", () => {
    describe("image >", () => {
        let subject: ImageComponent;
        const imagesPreset = [
            {
                svgFile: "test-image-one.svg",
                name: "test-image-one",
                brushType: "filled",
                code: "<svg>test svg</svg>",
            },
            {
                svgFile: "test-image-two.svg",
                name: "test-image-two",
                brushType: "filled",
                code: "<svg>test svg</svg>",
            },
        ] as Array<IImagesPresetItem>;
        const domSanitizer = {
            bypassSecurityTrustHtml: (code: string) => code as SafeHtml,
        } as DomSanitizer;
        const elRef: ElementRef = new ElementRef(`
                <nui-image float="right" id="image-float" image="no-data-to-show" ng-reflect-image="no-data-to-show" ng-reflect-float="right">
                    <div class="nui-image nui-image__hidden nui-image__right" ng-reflect-ng-style="[object Object]">
                        <svg width="137" height="92" viewBox="0 0 137 92"></svg>
                    </div>
                </nui-image>
        `);

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [UtilService, ChangeDetectorRef],
            });

            const utilService = TestBed.inject(UtilService);
            const changeDetector = TestBed.inject(ChangeDetectorRef);

            subject = new ImageComponent(
                new LoggerService(),
                utilService,
                changeDetector,
                imagesPreset,
                domSanitizer,
                elRef
            );
        });

        describe("getImageTemplate", () => {
            it("returns image code by given image name", () => {
                const image = _sample(imagesPreset);
                const imageName = image?.name;
                const expectedImageCode = image?.code as SafeHtml;

                subject.image = imageName;

                expect(subject.getImageTemplate()).toBe(expectedImageCode);
            });

            it("returns default image template if there is no image in the preset", () => {
                const imageName = "unavailableImage";
                const description = "Unavailable image";
                const expectedImageTemplate = `<img src="${imageName}" alt="${description}">`;

                subject.image = imageName;
                subject.description = description;

                expect(subject.getImageTemplate()).toBe(expectedImageTemplate);
            });
        });
    });
});
