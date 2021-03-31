import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import _isInteger from "lodash/isInteger";
import isNil from "lodash/isNil";

import {IconService} from "./icon.service";
import {IconData, IconStatus} from "./types";

/**
* <example-url>./../examples/index.html#/icon</example-url>
*/

@Component({
    selector: "nui-icon",
    templateUrl: "./icon.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "class": "nui-icon-wrapper",
        "role": "img",
    },
    styleUrls: ["./icon.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class IconComponent implements OnChanges {
    public static SIZE_MAP: { [key: string]: string } = {
        "medium": "nui-icon-size-md",
        "small": "nui-icon-size-sm",
    };

    @Input()
    iconColor: string;
    @Input()
    brushType: string = "filled";
    @Input()
    iconHoverColor: string;
    @Input()
    iconSize: string;
    @Input()
    cssClass: string;
    @Input()
    fillContainer = false;
    private _counter?: number;
    @Input()
    status: IconStatus;
    @Input()
    childStatus: IconStatus;
    @Input()
    icon: string;

    public resultingSvg: SafeHtml;

    private iconFound: boolean;
    private iconData: IconData;

    constructor(private iconService: IconService,
                private sanitizer: DomSanitizer) {
    }

    getIconByStatus(status: string) {
        if (!status) {
            return;
        }
        return this.iconService.getStatusIcon(status);
    }

    get iconClass() {
        const iconClass: string[] = ["nui-icon"];

        if (!this.iconFound) {
            iconClass.push("nui-icon-not-found");
        } else {

            if (this.brushType) {
                iconClass.push(this.brushType);
            }

            if (this.iconColor) {
                iconClass.push("custom-icon-color", `${this.iconColor}-icon`);
            }

            if (this.iconHoverColor) {
                iconClass.push(`${this.iconHoverColor}-hover-icon`);
            }

            const sizeClass = IconComponent.SIZE_MAP[this.iconSize];
            if (sizeClass) {
                iconClass.push(sizeClass);
            }

            if (this.cssClass) {
                iconClass.push(this.cssClass);
            }

            if (this.fillContainer) {
                iconClass.push("nui-icon--fill-container");
            }
        }

        return iconClass.join(" ");
    }

    @Input()
    set counter(value: string | number | undefined) {
        // eslint-disable-next-line no-undef-init
        let counterAttrValue = undefined;

        if (!isNil(value)) {
            counterAttrValue = +value;
        }

        if (_isInteger(counterAttrValue)) {
            this._counter = counterAttrValue;
        } else {
            this._counter = undefined;
        }
    }

    get counter(): string | number | undefined {
        // Using isNil to prevent toString of undefined error
        return isNil(this._counter) ? this._counter : this._counter.toString();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["status"] || changes["childStatus"] || changes["icon"]) {
            this.generateIcon();
        }
    }

    private generateIcon() {
        this.iconData = this.iconService.getIconData(this.icon);
        this.iconFound = !!this.iconData;
        let resultingSvg = `<div class='nui-icon-item'>${(this.iconData && this.iconData.code) ?? ""}</div>`;
        if (this.status) {
            resultingSvg += `<div class="nui-icon-item nui-icon-item__child">
                                    ${this.getIconByStatus(this.status)}
                                </div>`;
        }
        if (this.childStatus) {
            resultingSvg += `<div class="nui-icon-item nui-icon-item__grand-child">
                                        ${this.getIconByStatus(this.childStatus)}
                                 </div>`;
        }
        this.resultingSvg = this.sanitizer.bypassSecurityTrustHtml(resultingSvg);
    }
}
