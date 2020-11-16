import {Component, Input, OnInit, TemplateRef} from "@angular/core";
import _isObject from "lodash/isObject";
import _sortBy from "lodash/sortBy";

@Component({
    selector: "nui-recursive-object-view",
    template: `
        <div class="ml-5" *ngFor="let key of orderOfKeys">
            <div *ngIf="checkInstance(key); else notObject">
                <nui-expander [header]="key" icon="group">
                    <nui-recursive-object-view [object]="object[key]"
                                               [objectTemplate]="objectTemplate"
                                               [notObjectTemplate]="notObjectTemplate">
                        <ng-container [ngTemplateOutlet]="objectTemplate"
                                      [ngTemplateOutletContext]="{item: object[key]}"></ng-container>
                    </nui-recursive-object-view>
                </nui-expander>
            </div>
            <ng-template #notObject>
                <ng-container [ngTemplateOutlet]="notObjectTemplate"
                              [ngTemplateOutletContext]="{item: key}"></ng-container>
            </ng-template>
        </div>
    `,
})
export class RecursiveObjectViewComponent implements OnInit {
    @Input() object: any;
    @Input() objectTemplate: TemplateRef<string>;
    @Input() notObjectTemplate: TemplateRef<string>;

    public orderOfKeys: Array<string>;

    ngOnInit() {
        this.orderOfKeys = _sortBy(Object.keys(this.object), (key: string) => key.length);
    }

    public checkInstance(key: string) {
        return _isObject(this.object[key]);
    }
}
