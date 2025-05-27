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
    AnimationEvent,
    state,
    style,
    transition,
    trigger,
} from "@angular/animations";
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    ViewEncapsulation,
} from "@angular/core";
import { Subject, Subscription } from "rxjs";

// <example-url>./../examples/index.html#/message</example-url>
@Component({
    selector: "nui-message",
    templateUrl: "./message.component.html",
    animations: [
        trigger("dismiss", [
            state("initial", style({})),
            state(
                "dismissed",
                style({
                    opacity: 0,
                })
            ),
            transition("initial <=> dismissed", animate(`0.3s linear`)),
        ]),
    ],
    styleUrls: ["./message.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: { "[attr.role]": "role" },
})
export class MessageComponent implements OnInit, OnDestroy {
    public static ICON_MAP: { [id: string]: string } = {
        ok: "severity_ok",
        warning: "severity_warning",
        critical: "severity_critical",
        info: "severity_info",
    };
    public static UNKNOWN_ICON = "severity_unknown";

    @HostBinding("class.d-none") isHidden: boolean = false;

    @Input() public type: null | "ok" | "info" | "critical" | "warning";
    @Input() public allowDismiss: boolean = true;
    @Input() public manualControl: Subject<boolean>;

    /**
     * emits value when user closed message by clicking (x) button
     */
    @Output() public dismiss = new EventEmitter();

    public dismissState: "initial" | "dismissed" = "initial";
    private dismissSubscription: Subscription;

    get role(): string {
        return this.type === "ok" || this.type === "info" ? "status" : "alert";
    }

    constructor(private element: ElementRef, private renderer: Renderer2) {}

    public ngOnInit(): void {
        if (this.manualControl) {
            this.dismissSubscription = this.manualControl.subscribe(
                (shown: boolean) => {
                    this.dismissState = shown ? "initial" : "dismissed";
                }
            );
        }
    }

    public ngOnDestroy(): void {
        this.dismiss.complete();
        if (this.dismissSubscription) {
            this.dismissSubscription.unsubscribe();
        }
    }

    public dismissMessage(): void {
        this.dismissState = "dismissed";
        this.dismiss.emit();
    }

    public animationFinished(event: AnimationEvent): void {
        if (event.toState === "dismissed") {
            if (this.manualControl) {
                this.isHidden = true;
            } else {
                this.renderer.removeChild(
                    this.element.nativeElement.parentNode,
                    this.element.nativeElement
                );
            }
        }
    }

    public animationStart(event: AnimationEvent): void {
        if (event.fromState === "dismissed") {
            this.isHidden = false;
        }
    }

    public get messageClass(): string {
        return this.type ? `nui-message-${this.type.toLowerCase()}` : "";
    }

    public get icon(): string {
        return (
            MessageComponent.ICON_MAP[this.type ?? ""] ||
            MessageComponent.UNKNOWN_ICON
        );
    }
}
