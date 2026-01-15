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

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SafeHtml } from "@angular/platform-browser";
import _sample from "lodash/sample";

import { ImageComponent } from "./image.component";
import { IImagesPresetItem } from "./public-api";
import { imagesPresetToken } from "../../constants/images.constants";
import { LoggerService } from "../../services/log-service";
import { UtilService } from "../../services/util.service";

function unwrapSafeHtml(safeHtml: SafeHtml): string {
    return (safeHtml as { changingThisBreaksApplicationSecurity: string }).changingThisBreaksApplicationSecurity;
}

describe("components >", () => {
    describe("image >", () => {
        let fixture: ComponentFixture<ImageComponent>;
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

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [ImageComponent],
                providers: [
                    UtilService,
                    LoggerService,
                    { provide: imagesPresetToken, useValue: imagesPreset },
                ],
            });

            fixture = TestBed.createComponent(ImageComponent);
            subject = fixture.componentInstance;
        });

        describe("getImageTemplate", () => {
            it("returns image code by given image name", () => {
                const image = _sample(imagesPreset);
                const imageName = image?.name;
                const expectedImageCode = image?.code as string;

                fixture.componentRef.setInput("image", imageName);
                fixture.detectChanges();

                const result = unwrapSafeHtml(subject.imageTemplate);
                expect(result).toContain(expectedImageCode);
            });

            it("returns default image template if there is no image in the preset", () => {
                const imageName = "unavailableImage";
                const description = "Unavailable image";
                const expectedImageTemplate = `<img src="${imageName}" alt="${description}">`;

                fixture.componentRef.setInput("image", imageName);
                fixture.componentRef.setInput("description", description);
                fixture.detectChanges();

                const result = unwrapSafeHtml(subject.imageTemplate);
                expect(result).toContain(expectedImageTemplate);
            });
        });
    });
});
