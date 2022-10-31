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
