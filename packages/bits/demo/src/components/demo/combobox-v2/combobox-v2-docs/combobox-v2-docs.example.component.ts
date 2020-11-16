import { Component } from "@angular/core";

@Component({
    selector: "nui-combobox-v2-docs-example",
    templateUrl: "./combobox-v2-docs.example.component.html",
    styleUrls: ["combobox-v2-docs.example.component.less"],
})
export class ComboboxV2DocsComponent {
    public scrollTo($element: HTMLElement): void {
        $element.scrollIntoView(true);
        const scrolledY = window.scrollY;

        if (scrolledY) {
            window.scroll(0, scrolledY - 40);
        }
    }
}
