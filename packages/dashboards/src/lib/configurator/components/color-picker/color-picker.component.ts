import { Overlay, OverlayConfig } from "@angular/cdk/overlay";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { getOverlayPositions, IOptionValueObject, IResizeConfig, NuiFormFieldControl, OverlayUtilitiesService, SelectV2Component } from "@nova-ui/bits";
import { getColorValueByName } from "@nova-ui/charts";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { IPaletteColor } from "../../../types";

import { ColorService } from "./color.service";

// Left and right paddings of .color-picker-container element
const CONTAINER_SIDE_PADDINGS_PX: number = 20;
// Width of the .box element
const BOX_WIDTH_PX: number = 30;

@Component({
    selector: "nui-color-picker",
    templateUrl: "./color-picker.component.html",
    styleUrls: ["./color-picker.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => ColorPickerComponent),
            multi: true,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorPickerComponent),
            multi: true,
        },
        ColorService,
    ],
})
export class ColorPickerComponent implements NuiFormFieldControl, ControlValueAccessor, OnChanges, AfterViewInit, OnDestroy {
    @Input() colors: string[];
    @Input() colorPalette: IPaletteColor[];
    @Input() cols: number | undefined;

    @ViewChild(forwardRef(() => SelectV2Component)) public select: SelectV2Component;

    public overlayConfig: OverlayConfig;
    public value: string | IOptionValueObject;
    public isInErrorState: boolean;
    public defaultColor: string = "var(--nui-color-bg-secondary)";
    public maxWidth: string;
    public palette: Partial<IPaletteColor[]>;
    public isBlackTick: boolean;
    protected overlayUtilities: OverlayUtilitiesService = new OverlayUtilitiesService();

    private selectResizeObserver: ResizeObserver;
    private destroy$: Subject<any> = new Subject<any>();

    constructor(protected changeDetection: ChangeDetectorRef,
        private colorService: ColorService,
        private cdkOverlay: Overlay) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.colors) {
            this.colors = changes.colors.currentValue;
        }

        if (changes.colorPalette) {
            this.colorPalette = changes.colorPalette.currentValue;
        }
    }

    ngAfterViewInit() {
        if (this.value) {
            this.select?.writeValue(this.value);
            this.isBlackTick = this.determineBlackTick(this.value.toString());
        }

        this.palette = this.colorPalette || this.colors.map(color => ({ color }));

        this.initOverlayUtilities();

        this.select.valueSelected
            .pipe(
                tap(value => this.writeValue(value as any)),
                tap(value => this.onChange(value)),
                takeUntil(this.destroy$)
            )
            .subscribe((value) => {
                if (value) {
                    this.isBlackTick = this.determineBlackTick(value.toString());
                }
            });

        const positions = getOverlayPositions();

        const positionStrategy = this.cdkOverlay.position()
            .flexibleConnectedTo(this.select.elRef.nativeElement)
            .withPush(false)
            .withViewportMargin(0)
            .withPositions([
                positions["bottom-right"],
                positions["bottom-left"],
                positions["top-right"],
                positions["top-left"],
            ]);

        this.overlayConfig = {
            maxWidth: this.cols ? (this.cols * BOX_WIDTH_PX) + CONTAINER_SIDE_PADDINGS_PX + "px" : "260px",
            positionStrategy,
        };
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onChange(value: any) {}

    _onTouched() {}

    public writeValue(value: string | IOptionValueObject) {
        this.value = value;
        this.select?.writeValue(value);
    }

    public registerOnChange(fn: () => void) {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}) {
        this._onTouched = fn;
    }

    public setStyles =  (color: string) => ({ "background-color": color || this.defaultColor });

    public determineBlackTick(color: string) {
        let hexColorValue = "#fff";

        if (this.colorService.isHEX(color)) {
            hexColorValue = color;
        } else {
            hexColorValue = getColorValueByName(color) || this.colorService.RGBToHexRGBToHex(color) || this.colorService.colorKeywordsToHex(color);
        }

        return this.getContrastOnBgColor(hexColorValue) === "#fff";
    }

    private initOverlayUtilities() {
        const dropdown = this.select.dropdown;
        const config = { updateSize: false } as IResizeConfig;
        this.selectResizeObserver = this.overlayUtilities
            .setPopupComponent(this.select.dropdown)
            .getResizeObserver(config);

        dropdown.show$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.overlayUtilities.syncWidth();
            this.selectResizeObserver.observe(this.select.elRef.nativeElement);
        });

        dropdown.hide$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.selectResizeObserver.unobserve(this.select.elRef.nativeElement);
        });
    }

    // convert hex code to rgb and compare the contrast of pure black and pure white on bgColor
    private getContrastOnBgColor(bgColor: string) {
        if (!bgColor) { return ""; }

        return (parseInt(bgColor.replace("#", ""), 16) > 0xffffff / 2) ? "#fff" : "#000";
    }
}
