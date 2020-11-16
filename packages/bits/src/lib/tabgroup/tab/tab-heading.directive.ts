import { Directive, TemplateRef } from "@angular/core";

import { TabComponent } from "./tab.component";

/** Should be used to mark <ng-template> element as a template for tab heading */
/** @ignore */
@Directive({ selector: "[nuiTabHeading]" })
export class TabHeadingDirective {
    templateRef: TemplateRef<any>;

    constructor(templateRef: TemplateRef<any>, tab: TabComponent) {
        tab.headingRef = templateRef;
    }
}
