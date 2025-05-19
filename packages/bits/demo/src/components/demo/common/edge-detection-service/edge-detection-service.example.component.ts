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

import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import _set from "lodash/set";

import { EdgeDetectionService, IEdgeDetectionResult } from "@nova-ui/bits";

@Component({
    selector: "nui-edge-detection-service-example",
    templateUrl: "./edge-detection-service.example.component.html",
    styleUrls: ["./edge-detection-service.example.component.less"],
    standalone: false,
})
export class EdgeDetectionServiceExampleComponent implements AfterViewInit {
    @ViewChild("parent") private parentElement: ElementRef;
    @ViewChild("placementElement") private toBePlacedElement: ElementRef;

    public showPlaced: any = {};
    public showAligned: any = {};
    public deposit = {
        width: 100,
        height: 50,
    };
    public parentComponent = {
        width: 300,
        height: 150,
    };
    public addEdgeDefinerClass = false;

    public canBe?: IEdgeDetectionResult = {
        placed: {
            top: false,
            right: false,
            bottom: false,
            left: false,
        },
        aligned: {
            top: false,
            right: false,
            bottom: false,
            left: false,
        },
    };

    constructor(private edgeDetectionService: EdgeDetectionService) {}

    public ngAfterViewInit(): void {
        this.update();
    }

    public update(): void {
        setTimeout(() => {
            const parent = this.parentElement.nativeElement;
            const basePointElement = parent.querySelector(
                ".base-point-element"
            );

            if (this.parentComponent.width < 300) {
                this.parentComponent.width = 300;
            }

            if (this.parentComponent.height < 50) {
                this.parentComponent.height = 50;
            }

            if (this.addEdgeDefinerClass) {
                parent.classList.add("nui-edge-definer");
            } else {
                parent.classList.remove("nui-edge-definer");
            }

            this.canBe = this.edgeDetectionService.canBe(
                basePointElement,
                this.toBePlacedElement.nativeElement
            );
        });
    }

    public switchCheckbox(): void {
        this.addEdgeDefinerClass = !this.addEdgeDefinerClass;
        this.update();
    }

    public changeText(path: string, value: any): void {
        _set(this, path, value);
        this.update();
    }
}
