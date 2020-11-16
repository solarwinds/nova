import {
    animate,
    AnimationEvent,
    state,
    style,
    transition,
    trigger
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
    ViewEncapsulation
} from "@angular/core";
import { Subject, Subscription } from "rxjs";

// <example-url>./../examples/index.html#/message</example-url>
@Component({
    selector: "nui-message",
    templateUrl: "./message.component.html",
    animations: [
        trigger("dismiss", [
            state("initial", style({})),
            state("dismissed", style({
                opacity: 0,
            })),
            transition("initial <=> dismissed", animate(`0.3s linear`)),
        ])],
    styleUrls: ["./message.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class MessageComponent implements OnInit, OnDestroy {
    public static ICON_MAP: { [id: string]: string } = {
        "ok": "severity_ok",
        "warning": "severity_warning",
        "critical": "severity_critical",
        "info": "severity_info",
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

    constructor(private element: ElementRef,
                private renderer: Renderer2) { }

    public ngOnInit() {
        if (this.manualControl) {
            this.dismissSubscription = this.manualControl.subscribe((shown: boolean) => {
                this.dismissState = shown ? "initial" : "dismissed";
            });
        }
    }

    public ngOnDestroy() {
        this.dismiss.complete();
        if (this.dismissSubscription) {
            this.dismissSubscription.unsubscribe();
        }
    }

    public dismissMessage() {
        this.dismissState = "dismissed";
        this.dismiss.emit();
    }

    public animationFinished(event: AnimationEvent) {
        if (event.toState === "dismissed") {
            if (this.manualControl) {
                this.isHidden = true;
            } else {
                this.renderer.removeChild(this.element.nativeElement.parentNode, this.element.nativeElement);
            }
        }
    }

    public animationStart(event: AnimationEvent) {
        if (event.fromState === "dismissed") {
            this.isHidden = false;
        }
    }

    public get messageClass(): string {
        return this.type ? `nui-message-${this.type.toLowerCase()}` : "";
    }

    public get icon() {
        // @ts-ignore: Type 'null' cannot be used as an index type.
        const icon = MessageComponent.ICON_MAP[this.type];
        return icon ? icon : MessageComponent.UNKNOWN_ICON;
    }
}
