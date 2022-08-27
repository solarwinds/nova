import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { Subject } from "rxjs";

import { AccordionState } from "../../../types";
import { WidgetConfiguratorSectionCoordinatorService } from "../widget-configurator-section/widget-configurator-section-coordinator.service";

/** @ignore */
@Component({
    selector: "nui-widget-editor-accordion",
    templateUrl: "./widget-editor-accordion.component.html",
    encapsulation: ViewEncapsulation.None,
    styleUrls: ["./widget-editor-accordion.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetEditorAccordionComponent implements OnInit, OnDestroy {
    @Input() public showOpenStateIcon: boolean = true;

    @Input() public state: AccordionState = AccordionState.DEFAULT;

    public open = false;
    public openSubject = new Subject<void>();
    public destroySubject = new Subject<void>();

    constructor(
        private accordionCoordinator: WidgetConfiguratorSectionCoordinatorService,
        public cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.accordionCoordinator.registerAccordion(this);
    }

    public openChange(isOpened: boolean) {
        if (isOpened) {
            this.openSubject.next();
        } else {
            this.closeAccordion();
        }
    }

    public closeAccordion() {
        this.cd.markForCheck();
        this.open = false;
    }

    ngOnDestroy() {
        this.destroySubject.next();
        this.destroySubject.complete();
    }
}
