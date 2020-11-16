import {
    Component,
    HostBinding,
    Input,
    ViewEncapsulation
} from "@angular/core";

import { DividerSize } from "./public-api";

// <example-url>./../examples/index.html#/divider</example-url>

/** @ignore */
@Component({
    selector: "nui-divider",
    template: "",
    host: { "class": "nui-divider" },
    styleUrls: ["./divider.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
})
export class DividerComponent {
    /**
     * Defines if divider is vertical.
     */
    @Input() isVertical: boolean;

    /**
     * Defines divider's margins.
     */
    @Input() size: DividerSize;

    @HostBinding("class.nui-divider--vertical") public get isVerticalDivider() {
        return this.isVertical;
    }

    @HostBinding("class.nui-divider--horizontal") public get isHorizontalDivider() {
        return !this.isVertical;
    }

    @HostBinding("class.nui-divider--no-margin") public get isNoMargins() {
        return this.size === "no-margin";
    }

    @HostBinding("class.xs") public get isExtraSmall() {
        return this.size === "extra-small";
    }

    @HostBinding("class.sm") public get isSmall() {
        return this.size === "small";
    }

    @HostBinding("class.md") public get isMedium() {
        return this.size === "medium";
    }
}
