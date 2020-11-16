import { Component } from "@angular/core";

@Component({
    selector: "nui-panel-nested-example",
    templateUrl: "./panel-nested.example.component.html",
})
export class PanelNestedExampleComponent {
    public isCollapsible = true;
    public isCollapsed = false;
    public isInnerCollapsed = true;
    public outerRepeat = [
        {
            name: "AvantiA",
            type: "V12",
            disabled: true,
        }, {
            name: "AvantiA",
            type: "V12",
            disabled: true,
        }, {
            name: "AvantiA",
            type: "V12",
            disabled: true,
        }, {
            name: "AvantiA",
            type: "V12",
            disabled: true,
        }];
    public innerRepeat = [
        {
            name: `AvantiA Item-${Math.round(Math.random() * 100)}`,
            type: "V12",
            disabled: true,
        }, {
            name: `AvantiA Item-${Math.round(Math.random() * 100)}`,
            type: "V12",
            disabled: true,
        }, {
            name: `AvantiA Item-${Math.round(Math.random() * 100)}`,
            type: "V12",
            disabled: true,
        }, {
            name: `AvantiA Item-${Math.round(Math.random() * 100)}`,
            type: "V12",
            disabled: true,
        }];
    public headerIcon = "filter";
    public headerIconCounter = 4;

    public onCollapseChange($event: boolean) {
        this.isCollapsed = $event;
    }
}
