import { Component, Input } from "@angular/core";

@Component({
    selector: "nui-widget-editor-accordion-header",
    templateUrl: "./widget-editor-accordion-header.component.html",
    styleUrls: [],
    standalone: false
})
export class WidgetEditorAccordionHeaderComponent {
    @Input() public headerIcon?: string;
    @Input() public iconColor?: string;
    @Input() public subtitle: string = "";
    @Input() public headerTitle: string = "";
}
