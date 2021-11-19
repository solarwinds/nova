import { Overlay, OverlayConfig } from "@angular/cdk/overlay";
import { ConnectedPosition } from "@angular/cdk/overlay/position/flexible-connected-position-strategy";
import { DOCUMENT } from "@angular/common";
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DOCUMENT_CLICK_EVENT } from "../../constants/event.constants";
import { EventBusService } from "../../services/event-bus.service";
import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "../overlay/constants";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";
import { PopupToggleDirective } from "../popup/popup-toggle.directive";

const POPUP_V2 = "nui-overlay";
const POPUP_VISIBLE = "visible";
const ADAPTER_OVERLAY_CONFIG: OverlayConfig = {
    panelClass: ["popup-adapter-overlay", OVERLAY_WITH_POPUP_STYLES_CLASS],
};

/** @dynamic */
@Component({
    selector: "nui-popup",
    templateUrl: "./popup-adapter.component.html",
    styleUrls: ["./popup-adapter.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        "class": "nui-popup",
        "role": "dialog",
        "[attr.aria-label]": "ariaLabel",
    },
})
export class PopupComponent implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy {
    @ContentChild(PopupToggleDirective)
    public popupToggle: PopupToggleDirective;

    @Input() public width: string = "auto";
    @Input() public get overlayConfig(): OverlayConfig { return this._overlayConfig; }
    public set overlayConfig(value: OverlayConfig) {
        this._overlayConfig = {
            ...ADAPTER_OVERLAY_CONFIG,
            ...value,
        };
    }
    @Input() public contextClass: string;
    @Input() public directionTop: boolean;
    @Input() public directionRight: boolean;
    @Input() public manualOpenControl: Subject<MouseEvent>;
    @Input() public appendToBody: boolean = false;
    @Input() public baseElementSelector: string;
    @Input() public isHostToggleRef: boolean;
    @Input() public ariaLabel: string = "Popup";

    @Input() set isOpen(open: boolean) {
        if (this.isContentInitialized) {
            this.isOpenHandler(open);
            return;
        }
        setTimeout(() => this.isOpenHandler(open));
    }
    get isOpen(): boolean {
        return !!this.popup?.showing;
    }

    @Output()
    public opened = new EventEmitter<boolean>();

    @ViewChild("popupArea", { static: true }) popupArea: ElementRef;
    @ViewChild(OverlayComponent) popup: OverlayComponent;

    public popupAreaContainer: ElementRef;
    public popupAreaContent: ElementRef;
    public toggleReference: HTMLElement;
    public customContainer?: ElementRef;

    @Input()
    public set visible(value: boolean) {
        this._visible = value;
        if (value) {
            this.popup.getOverlayRef().addPanelClass(POPUP_VISIBLE);
            return;
        }
        this.popup.getOverlayRef().removePanelClass(POPUP_VISIBLE);

    }
    public get visible(): boolean {
        return Boolean(this._visible);
    }

    private _visible: boolean;
    private _overlayConfig: OverlayConfig = ADAPTER_OVERLAY_CONFIG;
    private isContentInitialized: boolean;
    private destroy$: Subject<void> = new Subject();
    private lastEventType: string;

    constructor(
        private overlay: Overlay,
        private cdRef: ChangeDetectorRef,
        private eventBusService: EventBusService,
        private host: ElementRef,
        @Inject(DOCUMENT) private document: Document
    ) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.appendToBody) {
            if (changes.appendToBody?.currentValue === false) {
                this.customContainer = this.popupArea;
            } else {
                this.customContainer = undefined;
            }
        }

        if (changes.width) {
            this.overlayConfig = { ...this.overlayConfig, width: this.width };
        }

        if (changes.directionTop || changes.directionRight) {
            this.overlayConfig = { ...this.overlayConfig, positionStrategy: this.getPositionStrategy() };
        }
    }

    public ngAfterContentInit(): void {
        this.isContentInitialized = true;
        this.initToggleRef();

        this.overlayConfig = { ...this.overlayConfig, positionStrategy: this.getPositionStrategy() };

        if (this.popupToggle) {
            this.popupToggle.toggle.subscribe((e: Event) => this.toggleOpened(e));
        }
    }

    public ngAfterViewInit(): void {
        this.overlayConfig = { ...this.overlayConfig, width: this.width };

        if (this.manualOpenControl) {
            this.manualOpenControl.subscribe((e: Event) => this.toggleOpened(e));
        }

        if (!this.appendToBody) {
            this.customContainer = this.popupArea;
        }

        this.eventBusService.getStream({ id: DOCUMENT_CLICK_EVENT })
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((event: Event) => {
                const isToggle = this.popupToggle && event ? (this.popupToggle.host.nativeElement as HTMLElement)
                    .contains(event.target as HTMLElement) : false;
                if (this.isOpen && !isToggle) {
                    this.closePopup();
                }
            });

        this.cdRef.detectChanges();
    }

    public toggleOpened(event: Event): void {
        let emit = true;
        if (event) {
            if (this.lastEventType === "focusin" && event.type === "focusin") {
                if (this.isOpen) {
                    emit = true;
                }
            }
            // since click triggers focusin event, we need to prevent popup from closing
            // when focus on the input is gained via click
            if (this.lastEventType === "focusin" && event.type === "click") {
                emit = false;
            }

            // if popup is already closed, prevent it from opening on focusout
            if (event.type === "focusout" && !this.isOpen) {
                emit = false;
            }

            this.lastEventType = event.type;
        }
        if (emit) {
            this.toggle();
        }
    }

    public closePopup(): void {
        this.hide();
    }

    ngOnDestroy(): void {
        if (this.isOpen) {
            this.hide();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    private getPopupConnectedPosition(): ConnectedPosition[] {
        const leftBottom: ConnectedPosition = {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top",
        };
        const topRight: ConnectedPosition = {
            originX: "start",
            originY: "top",
            overlayX: "start",
            overlayY: "bottom",
        };
        const topLeft: ConnectedPosition = {
            originX: "end",
            originY: "top",
            overlayX: "start",
            overlayY: "bottom",
        };
        const bottomRight: ConnectedPosition = {
            originX: "end",
            originY: "bottom",
            overlayX: "center",
            overlayY: "top",
            panelClass: "translate-right",
        };
        const bottomLeft: ConnectedPosition = {
            originX: "end",
            originY: "bottom",
            overlayX: "end",
            overlayY: "top",
        };
        const rightTop: ConnectedPosition = {
            originX: "end",
            originY: "top",
            overlayX: "center",
            overlayY: "bottom",
            panelClass: "translate-right",
        };

        if (this.directionTop && this.directionRight) {
            return [rightTop];
        }

        if (this.directionTop) {
            return [topRight, topLeft];
        }

        if (this.directionRight) {
            return [bottomRight, bottomLeft];
        }

        return [
            leftBottom,
            topRight,
            topLeft,
            bottomRight,
            bottomLeft,
            rightTop,
        ];
    }

    private getPositionStrategy() {
        const defaultViewportMargin = 0;

        return this.overlay.position()
            .flexibleConnectedTo(this.toggleReference)
            .withPush(false)
            .withViewportMargin(defaultViewportMargin)
            .withPositions(this.getPopupConnectedPosition());
    }

    private isOpenHandler(open: boolean): void {
        open ? this.show() : this.hide();
    }

    private show(): void {
        if (!this.toggleReference) {
            return;
        }

        this.initToggleRef();
        this.popup.show();

        const overlayContainer = this.popup.getOverlayRef().overlayElement;

        this.popupAreaContent = new ElementRef(overlayContainer);
        this.popupAreaContainer = new ElementRef(overlayContainer.querySelector(`.${POPUP_V2}`));

        if (this.contextClass) {
            this.contextClass.split(" ").forEach(contextClass => {
                this.popupAreaContainer.nativeElement.classList.add(contextClass);
            });
        }

        this.visible = true;
        this.opened.emit(this.popup.showing);
    }

    private hide(): void {
        this.visible = false;
        setTimeout(() => {
            this.popup.hide();
            this.opened.emit(this.popup.showing);
        });
    }

    private toggle(): void {
        this.popup.showing ? this.hide() : this.show();
        this.popup.getOverlayRef().updatePosition();
    }

    private initToggleRef(): void {
        if (this.isHostToggleRef) {
            this.toggleReference = this.host.nativeElement;
            return;
        }
        this.toggleReference = this.popupToggle ?
            this.popupToggle.host.nativeElement :
            this.document.querySelector(this.baseElementSelector);
    }
}
