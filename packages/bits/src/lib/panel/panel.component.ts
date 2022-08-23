import {
    animate,
    AnimationBuilder,
    AnimationFactory,
    AnimationPlayer,
    style,
} from "@angular/animations";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from "@angular/core";
import isUndefined from "lodash/isUndefined";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";

import {
    PanelBackgroundColor,
    PanelModes,
    PanelStates,
    SizeParameters,
} from "./public-api";

// <example-url>./../examples/index.html#/panel</example-url>

const panelMap: any = {
    top: {
        orientation: "top",
        icon: {
            collapsed: "double-caret-down",
            opened: "double-caret-up",
        },
    },
    bottom: {
        orientation: "bottom",
        icon: {
            collapsed: "double-caret-up",
            opened: "double-caret-down",
        },
    },
    right: {
        orientation: "right",
        icon: {
            collapsed: "double-caret-left",
            opened: "double-caret-right",
        },
    },
    left: {
        orientation: "left",
        icon: {
            collapsed: "double-caret-right",
            opened: "double-caret-left",
        },
    },
};

@Component({
    selector: "nui-panel",
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class PanelComponent
    implements AfterViewInit, OnChanges, OnInit, OnDestroy
{
    public static ANIMATION_TIME = 300;
    public static RESIZE_DIRECTIVE_WIDTH = "8px";
    public static SIZE_VALUES: any = {
        width: {
            COLLAPSED_VALUE: "40px",
            MIN_VALUE: "150px",
            DEFAULT_VALUE: "250px",
            MAX_VALUE: "90%",
        },
        height: {
            COLLAPSED_VALUE: "40px",
            MIN_VALUE: "40px",
            DEFAULT_VALUE: "120px",
            MAX_VALUE: "90%",
        },
    };

    /**
     * Use this attribute to set the mode of the panel, by default is set to 'static',
     * collapsible mode allows panel to be opened or collapsed, 'hoverable' mode make panel displayed with the hover,
     * 'closable' allows to close panel by click.
     */

    @Input() panelMode = PanelModes.static;

    /**
     * Use this attribute to set the text for the header if transclusion of custom header content is not being used.
     */
    @Input() heading: string;

    /**
     * Set this to true in order to set the collapsed state of the side pane
     */
    @Input() set isCollapsed(value: boolean) {
        // used to catch first ngOnChanges
        if (!isUndefined(this._isCollapsed)) {
            this.defineIsCollapsed(value);
        } else {
            this._isCollapsed = false;
        }
    }

    get isCollapsed(): boolean {
        return this._isCollapsed;
    }

    /**
     * Show sidebar over content if displacePrimaryContent = false, show sidebar near content if displacePrimaryContent = true
     */
    @Input() displacePrimaryContent = true;

    /**
     * Set this to true in order to hide the side pane. This may be useful if you want to use nui-panel but want to
     * show the left pane conditionally.
     */
    @Input() set isHidden(value: boolean) {
        if (this.isClosable && this._isHidden !== value) {
            this.toggleHideOrCollapsed();
        }
    }

    get isHidden(): boolean {
        return this._isHidden;
    }

    /**
     * Define orientation of a panel. Possible values are: "right", "left", "top", "bottom"
     */
    @Input() orientation: string = "left";

    /**
     * Use this attribute to make side pane resizable.
     */
    @Input() isResizable = false;

    /**
     * Use this attribute to remove default padding from header.
     */
    @Input() headerPadding = true;

    /**
     * Use this attribute to remove default padding from side pane body.
     */
    @Input() sidePaneBodyPadding = true;

    /**
     * Use this attribute to set pane right border dark color.
     */
    @Input() darkBorder = false;

    /**
     * Use this attribute to set the desired size for the side pane in pixels. The default is 250px.
     */
    @Input() paneSize: string;

    @Input() panelBackgroundColor: PanelBackgroundColor =
        PanelBackgroundColor.colorBgLight;

    @Input() paneCollapsedSize: string;
    @Input() paneMinSize: string;
    @Input() paneMaxSize: string;

    @Output() collapsed: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() hidden: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild("mainContent", { read: ViewContainerRef })
    private panelMainContent: ViewContainerRef;
    @ViewChild("headerContent", { read: ViewContainerRef })
    private headerContent: ViewContainerRef;
    @ViewChild("footerContent", { read: ViewContainerRef })
    private footerContent: ViewContainerRef;
    @ViewChild("sidePaneContainer", { static: true, read: ViewContainerRef })
    private sidePaneContainer: ViewContainerRef;

    public displayFooter = true;
    public displayPanelHeader = true;
    public isCollapsible = false;
    public isClosable = false;
    public isHoverable = false;
    public isAnimating = false;

    private _isCollapsed: boolean;
    private _isHidden: boolean = false;
    private toggles = new Subject();
    private togglesSubscription: Subscription;
    private _expandAnimationFactory?: AnimationFactory;
    private _collapseAnimationFactory?: AnimationFactory;
    private lastAnimationPlayer?: AnimationPlayer;

    constructor(
        private renderer: Renderer2,
        private builder: AnimationBuilder,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.defineSizes();
        this.defineState();
        this.togglesSubscription = this.toggles
            .pipe(filter((toggle) => toggle === this._isCollapsed))
            .pipe(distinctUntilChanged())
            .pipe(debounceTime(PanelComponent.ANIMATION_TIME))
            .subscribe((toggle) => this.toggleHideOrCollapsed());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["panelMode"] && changes["panelMode"].isFirstChange()) {
            this.defineSizes();
        }
        this.updatePaneContainerSizeWithoutAnimation();
        if (changes["panelMode"]) {
            this.defineState();
        }
        if (changes["isCollapsed"] && changes["isCollapsed"].isFirstChange()) {
            this.isCollapsed = changes.isCollapsed.currentValue;
        }
        if (changes["isHidden"] && changes["isHidden"].isFirstChange()) {
            this.isHidden = changes.isHidden.currentValue;
        }
    }

    ngAfterViewInit(): void {
        if (this.orientation === panelMap.bottom.orientation) {
            this.isResizable = false;
        }
        this.displayFooter = !this.paneDirectionHorizontal;
        this.checkPanelEmbeddedContent();
        this.handleContentMargin();
        this.updatePaneContainerSizeWithoutAnimation();
    }

    ngOnDestroy(): void {
        this.destroyLastAnimationPlayer();
        this.destroyAnimationFactories();
        if (this.togglesSubscription) {
            this.togglesSubscription.unsubscribe();
        }
    }

    public onSizeChanged(newSize: string) {
        this.paneSize = newSize;
    }

    public get panelClass(): string {
        return panelMap[this.orientation].class;
    }

    public get paneDirectionHorizontal(): boolean {
        return (
            this.orientation === panelMap.top.orientation ||
            this.orientation === panelMap.bottom.orientation
        );
    }

    public get mainIcon(): string {
        return panelMap[this.orientation].icon[this.panelState];
    }

    public toggleEnter() {
        if (this.isHoverable) {
            this.toggles.next(true);
        }
    }

    public toggleLeave() {
        if (this.isHoverable) {
            this.toggles.next(false);
        }
    }

    public isPanelResizable() {
        return this.isResizable && !this.isCollapsed;
    }

    public toggleHideOrCollapsed(): void {
        if (this.isClosable) {
            this._isHidden = !this._isHidden;
            this.hidden.emit(this._isHidden);
        } else {
            this.toggleCollapsed();
        }
    }

    private toggleCollapsed() {
        const animationFactory = this._isCollapsed
            ? this.expandAnimationFactory
            : this.collapseAnimationFactory;
        const sizeValue = this._isCollapsed
            ? this.paneSize
            : this.paneCollapsedSize;
        const animationPlayer = animationFactory.create(
            this.getPaneContainerElement()
        );
        animationPlayer.play();
        this.isAnimating = true;
        animationPlayer.onDone(() => {
            this.lastAnimationPlayer = animationPlayer;
            this.renderer.setStyle(
                this.getPaneContainerElement(),
                this.sizeParameter,
                sizeValue
            );
            this.destroyLastAnimationPlayer();
            this._isCollapsed = !this._isCollapsed;
            this.collapsed.emit(this._isCollapsed);
            this.isAnimating = false;
            if (this.isResizable) {
                this.isCollapsed
                    ? this.removeMinSize()
                    : this.applyBoundarySizes();
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    private defineIsCollapsed(isCollapsedToBecome: boolean) {
        if (this._isCollapsed !== isCollapsedToBecome) {
            this.toggleCollapsed();
        }
    }

    public getResizeDirection(): string | undefined {
        switch (this.orientation) {
            case "left":
                return "right";
            case "right":
                return "left";
            case "top":
                return "bottom";
            case "bottom":
                return "top";
            default: {
                return undefined;
            }
        }
    }

    public getPaneSizeMeasurement(): string {
        return this.paneSize.indexOf("%") !== -1 ? "%" : "px";
    }

    public get paneBodyWidth(): string {
        return !this.paneDirectionHorizontal ? this.paneSize : "auto";
    }

    public get paneBodyHeight(): string {
        return this.paneDirectionHorizontal ? this.paneSize : "auto";
    }

    public handleContentMargin(): void {
        if (!this.displacePrimaryContent && !this.isClosable) {
            this.renderer.setStyle(
                this.getPanelMainContentElement(),
                "margin-" + this.orientation,
                this.paneCollapsedSize
            );
        }
    }

    public applyBoundarySizes() {
        if (this.isResizable) {
            this.renderer.setStyle(
                this.getPaneContainerElement(),
                "min-" + this.sizeParameter,
                this.paneMinSize
            );
            this.renderer.setStyle(
                this.getPaneContainerElement(),
                "max-" + this.sizeParameter,
                this.paneMaxSize
            );
        }
    }

    public removeMinSize() {
        if (this.isResizable) {
            this.renderer.setStyle(
                this.getPaneContainerElement(),
                "min-" + this.sizeParameter,
                "0"
            );
        }
    }

    public toggleCollapsedOnClick() {
        if (this.isHoverable) {
            return;
        } else {
            this.toggleHideOrCollapsed();
        }
    }

    public get sizeParameter(): string {
        return this.paneDirectionHorizontal
            ? SizeParameters.height
            : SizeParameters.width;
    }

    public get showDefaultIcon(): boolean {
        return (this.isClosable || this.isCollapsible) && !this.isHoverable;
    }

    private defineState() {
        this.isCollapsible = this.panelMode === PanelModes.collapsible;
        this.isClosable = this.panelMode === PanelModes.closable;
        this.isHoverable = this.panelMode === PanelModes.hoverable;
        if (this.isHoverable) {
            this._isCollapsed = true;
            this.isCollapsible = true;
        }
    }

    private defineSizes(): void {
        this.paneSize =
            this.paneSize ||
            PanelComponent.SIZE_VALUES[this.sizeParameter].DEFAULT_VALUE;
        this.paneCollapsedSize = !this.paneCollapsedSize
            ? PanelComponent.SIZE_VALUES[this.sizeParameter].COLLAPSED_VALUE
            : this.paneCollapsedSize;
        this.paneMinSize = !this.paneMinSize
            ? PanelComponent.SIZE_VALUES[this.sizeParameter].MIN_VALUE
            : this.paneMinSize;
        this.paneMaxSize = !this.paneMaxSize
            ? PanelComponent.SIZE_VALUES[this.sizeParameter].MAX_VALUE
            : this.paneMaxSize;
    }

    private get panelState(): string {
        return this._isCollapsed ? PanelStates.collapsed : PanelStates.opened;
    }

    private checkPanelEmbeddedContent(): void {
        this.displayPanelHeader =
            this.headerContent.element.nativeElement.children.length !== 0;
        this.changeDetectorRef.detectChanges();
    }

    private updatePaneContainerSizeWithoutAnimation(): void {
        // Manually update width of left pane container only if it is expanded.
        if (
            (!this.isCollapsible || !this._isCollapsed) &&
            this.sidePaneContainer
        ) {
            this.applyBoundarySizes();
            this.destroyLastAnimationPlayer();
            this.renderer.setStyle(
                this.getPaneContainerElement(),
                this.sizeParameter,
                this.paneSize
            );
        } else if (this._isCollapsed) {
            this.removeMinSize();
            this.destroyLastAnimationPlayer();
            this.renderer.setStyle(
                this.getPaneContainerElement(),
                this.sizeParameter,
                this.paneCollapsedSize
            );
        }
    }

    private getPaneContainerElement(): ElementRef {
        return this.sidePaneContainer.element.nativeElement;
    }

    private getPanelMainContentElement(): ElementRef {
        return this.panelMainContent.element.nativeElement;
    }

    private get expandAnimationFactory(): AnimationFactory {
        if (!this._expandAnimationFactory || this.isResizable) {
            this._expandAnimationFactory = this.buildAnimationFactory(
                this.paneCollapsedSize,
                this.paneSize
            );
        }
        return this._expandAnimationFactory;
    }

    private get collapseAnimationFactory(): AnimationFactory {
        this.removeMinSize();
        if (!this._collapseAnimationFactory || this.isResizable) {
            this._collapseAnimationFactory = this.buildAnimationFactory(
                this.paneSize,
                this.paneCollapsedSize
            );
        }
        return this._collapseAnimationFactory;
    }

    private buildAnimationFactory(
        startSize: string,
        endSize: string
    ): AnimationFactory {
        if (this.paneDirectionHorizontal) {
            return this.builder.build([
                style({
                    height: startSize,
                }),
                animate(
                    `${PanelComponent.ANIMATION_TIME}ms ease-in-out`,
                    style({
                        height: endSize,
                    })
                ),
            ]);
        }
        return this.builder.build([
            style({
                width: startSize,
            }),
            animate(
                `${PanelComponent.ANIMATION_TIME}ms ease-in-out`,
                style({
                    width: endSize,
                })
            ),
        ]);
    }

    private destroyLastAnimationPlayer(): void {
        if (this.lastAnimationPlayer) {
            this.lastAnimationPlayer.destroy();
            delete this.lastAnimationPlayer;
        }
    }

    private destroyAnimationFactories(): void {
        delete this._expandAnimationFactory;
        delete this._collapseAnimationFactory;
    }
}
