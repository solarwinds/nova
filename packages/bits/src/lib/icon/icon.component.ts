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
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import _isInteger from "lodash/isInteger";
import isNil from "lodash/isNil";

import { IconService } from "./icon.service";
import { IconData, IconStatus } from "./types";
import { computeA11yForGraphic } from "../../functions/a11y-graphics.util";

/**
 * <example-url>./../examples/index.html#/icon</example-url>
 */

@Component({
    selector: "nui-icon",
    templateUrl: "./icon.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "nui-icon-wrapper",
        "[attr.role]": "computedRole",
        "[attr.aria-hidden]": "computedAriaHidden",
        "[attr.aria-label]": "computedAriaLabel",
    },
    styleUrls: ["./icon.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class IconComponent implements OnChanges {
    public static SIZE_MAP: { [key: string]: string } = {
        medium: "nui-icon-size-md",
        small: "nui-icon-size-sm",
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
    /**
     * Marks the icon as purely decorative. Decorative icons are hidden from assistive technologies.
     */
    @Input() decorative?: boolean;
    /**
     * Accessible name for a meaningful icon. Ignored if `decorative` is true or empty.
     */
    @Input() ariaLabel?: string;
    /**
     * Optional explicit role override. Constrained to 'img' | 'presentation' | null.
     * If omitted, role is inferred from `decorative` and `ariaLabel`.
     */
    @Input() explicitRole?: "img" | "presentation" | null;

    public resultingSvg: SafeHtml;

    private iconFound: boolean;
    private iconData: IconData;

    constructor(
        private iconService: IconService,
        private sanitizer: DomSanitizer
    ) {}

    getIconByStatus(status: string): string {
        if (!status) {
            return "";
        }
        return this.iconService.getStatusIcon(status);
    }

    get iconClass(): string {
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

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["status"] || changes["childStatus"] || changes["icon"]) {
            this.generateIcon();
        }
    }

    // --- Accessibility via shared util ---
    private get a11y() {
        const statusParts: string[] = [];
        if (this.status) {
            statusParts.push(this.status.toLowerCase());
        }
        if (this.childStatus) {
            statusParts.push(this.childStatus.toLowerCase());
        }
        return computeA11yForGraphic({
            decorative: this.decorative,
            explicitRole: this.explicitRole,
            label: this.ariaLabel || this.icon || null,
            hasAlt: false,
            statusParts,
        });
    }

    get computedRole(): string | null {
        return this.a11y.role;
    }
    get computedAriaHidden(): string | null {
        return this.a11y.ariaHidden;
    }
    get computedAriaLabel(): string | null {
        return this.a11y.ariaLabel;
    }

    private generateIcon() {
        this.iconData = this.iconService.getIconData(this.icon);
        this.iconFound = !!this.iconData;
        let resultingSvg = `<div class='nui-icon-item'>${
            (this.iconData && this.iconData.code) ?? ""
        }</div>`;
        if (this.status) {
            resultingSvg += `<div class="nui-icon-item nui-icon-item__child">
                                    ${this.getIconByStatus(this.status)}
                                </div>`;
        }
        if (this.childStatus) {
            resultingSvg += `<div class="nui-icon-item nui-icon-item__grand-child">
                                        ${this.getIconByStatus(
                                            this.childStatus
                                        )}
                                 </div>`;
        }
        this.resultingSvg =
            this.sanitizer.bypassSecurityTrustHtml(resultingSvg);
    }
}
