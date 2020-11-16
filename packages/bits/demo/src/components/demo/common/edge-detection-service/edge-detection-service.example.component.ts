import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { EdgeDetectionService, IEdgeDetectionResult } from "@solarwinds/nova-bits";
import _set from "lodash/set";

@Component({
    selector: "nui-edge-detection-service-example",
    templateUrl: "./edge-detection-service.example.component.html",
    styleUrls: [
        "./edge-detection-service.example.component.less",
    ],
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

    constructor(private edgeDetectionService: EdgeDetectionService) {
    }

    public ngAfterViewInit(): void {
        this.update();
    }

    public update() {
        setTimeout(() => {
            const parent = this.parentElement.nativeElement;
            const basePointElement = parent.querySelector(".base-point-element");

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

            this.canBe = this.edgeDetectionService
                .canBe(basePointElement, this.toBePlacedElement.nativeElement);
        });
    }

    public switchCheckbox(): void {
        this.addEdgeDefinerClass = !this.addEdgeDefinerClass;
        this.update();
    }

    public changeText(path: string, value: any) {
        _set(this, path, value);
        this.update();
    }
}
