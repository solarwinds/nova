import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
/** @ignore */
@Directive({
    selector: "[nuiTabHeadingCustomTemplateRef]",
})
export class TabHeadingCustomTemplateRefDirective {
    viewRef: ViewContainerRef;

    protected _viewRef: ViewContainerRef;
    protected _tabHeadingCustomTemplateRef: TemplateRef<any>;

    @Input()
    set nuiTabHeadingCustomTemplateRef(templateRef: TemplateRef<any>) {
        this._tabHeadingCustomTemplateRef = templateRef;
        if (templateRef) {
            this.viewRef.createEmbeddedView(templateRef);
        }
    }

    get nuiTabHeadingCustomTemplateRef(): TemplateRef<any> {
        return this._tabHeadingCustomTemplateRef;
    }

    constructor(viewRef: ViewContainerRef) {
        this.viewRef = viewRef;
    }
}
