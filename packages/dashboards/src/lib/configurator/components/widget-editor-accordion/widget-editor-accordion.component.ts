// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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

    public ngOnInit(): void {
        this.accordionCoordinator.registerAccordion(this);
    }

    public openChange(isOpened: boolean): void {
        if (isOpened) {
            this.openSubject.next();
        } else {
            this.closeAccordion();
        }
    }

    public closeAccordion(): void {
        this.cd.markForCheck();
        this.open = false;
    }

    public ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }
}
