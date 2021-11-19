import { Component } from "@angular/core";

@Component({
    selector: "nui-panel-collapse-example",
    templateUrl: "./panel-collapse.example.component.html",
})
export class PanelCollapseExampleComponent {
    public isCollapsible = true;
    public isCollapsed = false;
    public headerIcon = "filter";
    public headerIconCounter = 7;

    public onCollapseChange($event: boolean): void {
        this.isCollapsed = $event;
    }
}
