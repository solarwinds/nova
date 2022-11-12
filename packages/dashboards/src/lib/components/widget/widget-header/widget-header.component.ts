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
    animate,
    state,
    style,
    transition,
    trigger,
} from "@angular/animations";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent } from "@nova-ui/bits";

import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import {
    DASHBOARD_EDIT_MODE,
    REFRESH,
    WIDGET_EDIT,
    WIDGET_REMOVE,
} from "../../../services/types";
import { WidgetToDashboardEventProxyService } from "../../../services/widget-to-dashboard-event-proxy.service";
import {
    HEADER_LINK_PROVIDER,
    PIZZAGNA_EVENT_BUS,
    PizzagnaLayer,
} from "../../../types";
import { IHeaderLinkProvider } from "./types";

@Component({
    selector: "nui-widget-header",
    templateUrl: "./widget-header.component.html",
    styleUrls: ["./widget-header.component.less"],
    animations: [
        trigger("expandedState", [
            state("expanded", style({ height: "*" })),
            state("collapsed", style({ height: "11px" })),
            transition("expanded <=> collapsed", [
                animate("350ms ease-in-out"),
            ]),
        ]),
    ],
})
export class WidgetHeaderComponent implements OnInit, OnDestroy, AfterViewInit {
    static lateLoadKey = "WidgetHeaderComponent";

    @Input() public componentId: string;
    @Input() public editMode = true;
    /**
     * Boolean which shows or hides the edit button
     */
    @Input() public editable: boolean = true;
    /**
     * Boolean which shows or hides the remove widget button
     */
    @Input() public removable: boolean = true;
    /**
     * Boolean which adds ability to collapse widget header
     */
    @Input() public collapsible = false;
    @Input() public reloadable = true;
    @Input() public title: string;
    @Input() public subtitle: string;
    @Input() public hideMenu: boolean = false;
    @Input() public url: string;
    /**
     * Boolean which tells what state the widget header is in if collapsible
     */
    @Input() public collapsed: boolean = false;

    @HostBinding("class.nui-widget-header") get hostClass() {
        return true;
    }

    @ViewChild("widgetHeaderCustomElement")
    public widgetHeaderCustomElement: ElementRef;

    public withCustomElement: boolean;
    private onDestroy$: Subject<void> = new Subject<void>();

    public get state(): "expanded" | "collapsed" {
        return this.collapsed && this.collapsible ? "collapsed" : "expanded";
    }

    public linkTooltip = $localize`Explore this data`;

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        public pizzagnaService: PizzagnaService,
        public changeDetector: ChangeDetectorRef,
        @Optional() private eventProxy: WidgetToDashboardEventProxyService,
        @Inject(HEADER_LINK_PROVIDER)
        @Optional()
        private linkProvider: IHeaderLinkProvider
    ) {}

    public ngOnInit(): void {
        if (this.collapsible) {
            this.pizzagnaService.setProperty(
                {
                    componentId: this.componentId,
                    pizzagnaKey: PizzagnaLayer.Data,
                    propertyPath: ["isCollapsed"],
                },
                true
            );
        }

        if (this.eventProxy) {
            this.eventProxy.addUpstream(WIDGET_EDIT);
            this.eventProxy.addUpstream(WIDGET_REMOVE);
            this.eventProxy.addDownstream(DASHBOARD_EDIT_MODE);
        }

        // subscribing to dashboard event to set 'edit mode'
        this.eventBus
            .getStream(DASHBOARD_EDIT_MODE)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((event) => {
                this.pizzagnaService.setProperty(
                    {
                        componentId: this.componentId,
                        pizzagnaKey: PizzagnaLayer.Data,
                        propertyPath: ["collapsed"],
                    },
                    !event.payload
                );

                this.pizzagnaService.setProperty(
                    {
                        componentId: this.componentId,
                        pizzagnaKey: PizzagnaLayer.Data,
                        propertyPath: ["editMode"],
                    },
                    !!event.payload
                );
            });
    }

    public ngAfterViewInit() {
        // we can't set values in ngAfterViewInit directly - it causes ExpressionChangedAfterViewChecked error, so setTimeout has to be used
        setTimeout(() => {
            this.withCustomElement =
                this.widgetHeaderCustomElement.nativeElement.childNodes
                    .length !== 0;
        });
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    public removeWidget() {
        this.eventBus.getStream(WIDGET_REMOVE).next(undefined);
    }

    public toggleCollapsed() {
        this.pizzagnaService.setProperty(
            {
                componentId: this.componentId,
                pizzagnaKey: PizzagnaLayer.Data,
                propertyPath: ["collapsed"],
            },
            !this.collapsed
        );
    }

    public onEditWidget() {
        this.eventBus.getStream(WIDGET_EDIT).next(undefined);
    }

    public onReloadData() {
        if (!this.reloadable) {
            throw new Error(
                "The widget is not reloadable, so it can't be reloaded manually."
            );
        }
        this.eventBus.getStream(REFRESH).next(undefined);
    }

    public prepareLink($event: MouseEvent) {
        const target: HTMLElement = $event.target as HTMLElement;
        if (target && this.linkProvider) {
            const link = this.linkProvider.getLink(this.url);
            if (link) {
                target.setAttribute("href", link);
            }
        }
        return true;
    }
}
