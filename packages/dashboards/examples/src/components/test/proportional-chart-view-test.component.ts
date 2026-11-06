import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import {
    IProportionalDataItem,
    NuiDashboardViewsModule,
} from "@nova-ui/dashboards";

@Component({
    selector: "proportional-chart-view-test",
    imports: [CommonModule, NuiDashboardViewsModule],
    template: `
        <h1>Proportional chart view keyboard test</h1>
        <p>
            Alpha runs an action (Enter or Space); it has no navigation link.
            Beta has both a navigation link (Enter) and a separate action.
        </p>
        <button type="button" (click)="interactive = !interactive">
            Toggle interaction
        </button>
        <button type="button" (click)="custom = !custom">
            Toggle custom template
        </button>
        <button type="button">Before legend</button>
        <div style="width: 700px; height: 300px">
            <nui-proportional-chart-view
                class="d-flex h-100 w-100"
                [data]="data"
                [interactive]="interactive"
                [legendItemTemplate]="custom ? legendTemplate : undefined"
                (itemClick)="recordInteraction($event)"
            ></nui-proportional-chart-view>
        </div>
        <button type="button">After legend</button>
        <p>Actions: {{ actionCount }}; Last item: {{ lastItem }}</p>
        <ng-template #legendTemplate let-item>
            <span>{{ item.name }} custom</span>
            <a
                [href]="'#/test/proportional-chart-view?item=' + item.id"
                (click)="$event.stopPropagation()"
            >
                More {{ item.name }}
            </a>
        </ng-template>
    `,
})
export class ProportionalChartViewTestComponent {
    public interactive = true;
    public custom = false;
    public actionCount = 0;
    public lastItem = "";
    public data: IProportionalDataItem[] = [
        { id: "alpha", name: "Alpha", value: 30, color: "#0058e9" },
        {
            id: "beta",
            name: "Beta",
            value: 70,
            color: "#2cc079",
            link: "#/test/proportional-chart-view?item=beta",
        },
    ];

    public recordInteraction(item: IProportionalDataItem): void {
        this.actionCount++;
        this.lastItem = item.id;
    }
}
