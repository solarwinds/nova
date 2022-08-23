import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "nuiWidgetConfiguratorSectionHeader",
})
export class WidgetConfiguratorSectionHeaderPipe implements PipeTransform {
    private readonly defaultHeaderPrefix = $localize`Value`;

    transform(
        headerText: string | undefined,
        index: number,
        headerPrefix: string = this.defaultHeaderPrefix
    ): string {
        return `${headerPrefix} ${index + 1}${headerText ? " - " : ""}${
            headerText || ""
        }`;
    }
}
