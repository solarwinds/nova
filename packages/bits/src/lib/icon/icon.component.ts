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

import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    inject,
    input,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import { IconService } from "./icon.service";
import { IconData, IconStatus } from "./types";
import { computeA11yForGraphic } from "../../functions/a11y-graphics.util";

/**
 * <example-url>./../examples/index.html#/icon</example-url>
 */

@Component({
    selector: "nui-icon",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./icon.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "nui-icon-wrapper",
        "[attr.role]": "computedRole()",
        "[attr.aria-hidden]": "computedAriaHidden()",
        "[attr.aria-label]": "computedAriaLabel()",
    },
    styleUrls: ["./icon.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class IconComponent {
    public static SIZE_MAP: { [key: string]: string } = {
        medium: "nui-icon-size-md",
        small: "nui-icon-size-sm",
    };

    private iconService = inject(IconService);
    private sanitizer = inject(DomSanitizer);

    public iconColor = input<string>();
    public brushType = input<string>("filled");
    public iconHoverColor = input<string>();
    public iconSize = input<string>();
    public cssClass = input<string>();
    public fillContainer = input<boolean>(false);
    public status = input<IconStatus>();
    public childStatus = input<IconStatus>();
    public icon = input<string>();
    public counter = input<string | number | undefined, string | number | undefined>(undefined, {
        transform: (value) => {
            if (value == null) {
                return undefined;
            }
            const counterAttrValue = +value;
            return Number.isInteger(counterAttrValue) ? counterAttrValue.toString() : undefined;
        },
    });

    /**
     * Marks the icon as purely decorative. Decorative icons are hidden from assistive technologies.
     */
    public decorative = input<boolean>();
    /**
     * Accessible name for a meaningful icon. Ignored if `decorative` is true or empty.
     */
    public ariaLabel = input<string>();
    /**
     * Optional explicit role override. Constrained to 'img' | 'presentation' | null.
     * If omitted, role is inferred from `decorative` and `ariaLabel`.
     */
    public explicitRole = input<"img" | "presentation" | null>();

    private iconData = computed<IconData | undefined>(() => {
        const iconName = this.icon();
        return iconName ? this.iconService.getIconData(iconName) : undefined;
    });

    private iconFound = computed(() => !!this.iconData());

    public iconClass = computed(() => {
        const classes: string[] = ["nui-icon"];

        if (!this.iconFound()) {
            classes.push("nui-icon-not-found");
        } else {
            const brushType = this.brushType();
            if (brushType) {
                classes.push(brushType);
            }

            const iconColor = this.iconColor();
            if (iconColor) {
                classes.push("custom-icon-color", `${iconColor}-icon`);
            }

            const iconHoverColor = this.iconHoverColor();
            if (iconHoverColor) {
                classes.push(`${iconHoverColor}-hover-icon`);
            }

            const iconSize = this.iconSize();
            const sizeClass = iconSize ? IconComponent.SIZE_MAP[iconSize] : undefined;
            if (sizeClass) {
                classes.push(sizeClass);
            }

            const cssClass = this.cssClass();
            if (cssClass) {
                classes.push(cssClass);
            }

            if (this.fillContainer()) {
                classes.push("nui-icon--fill-container");
            }
        }

        return classes.join(" ");
    });

    public resultingSvg = computed<SafeHtml>(() => {
        const iconData = this.iconData();
        const status = this.status();
        const childStatus = this.childStatus();

        let svg = `<div class='nui-icon-item'>${iconData?.code ?? ""}</div>`;

        if (status) {
            svg += `<div class="nui-icon-item nui-icon-item__child">${this.getIconByStatus(status)}</div>`;
        }

        if (childStatus) {
            svg += `<div class="nui-icon-item nui-icon-item__grand-child">${this.getIconByStatus(childStatus)}</div>`;
        }

        return this.sanitizer.bypassSecurityTrustHtml(svg);
    });

    private a11y = computed(() => {
        const statusParts: string[] = [];
        const status = this.status();
        const childStatus = this.childStatus();

        if (status) {
            statusParts.push(status.toLowerCase());
        }
        if (childStatus) {
            statusParts.push(childStatus.toLowerCase());
        }

        return computeA11yForGraphic({
            decorative: this.decorative(),
            explicitRole: this.explicitRole(),
            label: this.ariaLabel() || this.icon() || null,
            hasAlt: false,
            statusParts,
        });
    });

    public computedRole = computed(() => this.a11y().role);
    public computedAriaHidden = computed(() => this.a11y().ariaHidden);
    public computedAriaLabel = computed(() => this.a11y().ariaLabel);

    public getIconByStatus(status: string): string {
        if (!status) {
            return "";
        }
        return this.iconService.getStatusIcon(status);
    }
}
