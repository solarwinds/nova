import { Component } from "@angular/core";

@Component({
    selector: "nui-select-custom-template-example",
    templateUrl: "./select-custom-template.example.component.html",
    styleUrls: ["./select-custom-template.example.component.less"],
})
export class SelectCustomTemplateExampleComponent {
    public dataset = {
        displayValue: "value",
        selectedItem: "",
        items: [
            {
                name: "item_1",
                value: "Bonobo",
                icon: "severity_ok",
                progress: 78,
            },
            {
                name: "item_2",
                value: "Zelda",
                icon: "severity_ok",
                progress: 66,
            },
            {
                name: "item_3",
                value: "Max",
                icon: "severity_critical",
                progress: 7,
            },
            {
                name: "item_4",
                value: "Apple",
                icon: "severity_ok",
                progress: 24,
            },
            {
                name: "item_5",
                value: "Quartz",
                icon: "severity_warning",
                progress: 89,
            },
        ],
    };

    constructor() {}
}
