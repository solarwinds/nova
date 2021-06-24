import { Component, ElementRef, Input, OnInit, TemplateRef } from "@angular/core";

@Component({
    selector: "nui-wizard-overflow",
    templateUrl: "./wizard-overflow.component.html",
    styleUrls: ["./wizard-overflow.component.less"],
})
export class WizardOverflowComponent implements OnInit {
    public tooltipText: string = $localize` more steps are available`;

    @Input() template: TemplateRef<any>;
    @Input() value: number | string;
    @Input() completed = false;

    constructor(public el: ElementRef) { }

    ngOnInit(): void {
    }

}
