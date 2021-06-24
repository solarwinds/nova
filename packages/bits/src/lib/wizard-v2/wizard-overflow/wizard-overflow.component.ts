import { Component, Input, OnInit, TemplateRef } from "@angular/core";

@Component({
    selector: "nui-wizard-overflow",
    templateUrl: "./wizard-overflow.component.html",
    styleUrls: ["./wizard-overflow.component.less"],
})
export class WizardOverflowComponent implements OnInit {

    @Input() template: TemplateRef<any>;
    @Input() value: number | string;

    constructor() { }

    ngOnInit(): void {
    }

}
