import { Injectable } from "@angular/core";
import { ScrollType } from "@nova-ui/dashboards";

@Injectable()
export class ScrollTypeEditorService {
    public loadStrategies = [
        {
            id: ScrollType.virtual,
            title: $localize`Virtual scroll`,
        },
        {
            id: ScrollType.paginator,
            title: $localize`Paginator`,
        },
        {
            id: ScrollType.default,
            title: $localize`Default scroll`,
        },
    ];

    public setAccordionSubtitleValues(
        hasVirtualScroll: boolean,
        scrollType: ScrollType
    ): string {
        const prefix = $localize`Scroll Type: `;
        const result = hasVirtualScroll
            ? `${prefix} ${this.getScrollTypeTitle(ScrollType.virtual)}`
            : `${prefix} ${this.getScrollTypeTitle(scrollType)}`;

        return result;
    }

    public getScrollTypeTitle(scrollType: ScrollType): string {
        const result =
            this.loadStrategies.find((ls) => ls.id === scrollType)?.title ||
            $localize`Unknown`;

        return result;
    }
}
