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
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import {
    getOverlayPositions,
    IOptionValueObject,
    IResizeConfig,
    NuiFormFieldControl,
    OverlayUtilitiesService,
    SelectV2Component,
} from "@nova-ui/bits";
import { getColorValueByName } from "@nova-ui/charts";

import { ColorService } from "./color.service";
import { IPaletteColor } from "../../../types";

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
export class ColorPickerComponent
    implements
        NuiFormFieldControl,
        ControlValueAccessor,
        OnChanges,
        AfterViewInit,
        OnDestroy
{
    @Input() colors: string[];
    @Input() colorPalette: IPaletteColor[];
    @Input() cols: number | undefined;

    @ViewChild(forwardRef(() => SelectV2Component))
    public select: SelectV2Component;

    public overlayConfig: OverlayConfig;
    public value: string | IOptionValueObject;
    public defaultColor: string = "var(--nui-color-bg-secondary)";
    public maxWidth: string;
    public palette: Partial<IPaletteColor[]>;
    public isBlackTick: boolean;
    public isInErrorState: boolean;
    public ariaLabel?: string | undefined;

    protected overlayUtilities: OverlayUtilitiesService =
        new OverlayUtilitiesService();

    private selectResizeObserver: ResizeObserver;
    private destroy$ = new Subject<void>();

    constructor(
        protected changeDetection: ChangeDetectorRef,
        private colorService: ColorService,
        private cdkOverlay: Overlay
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.colors) {
            this.colors = changes.colors.currentValue;
        }

        if (changes.colorPalette) {
            this.colorPalette = changes.colorPalette.currentValue;
        }
    }

    public ngAfterViewInit(): void {
        if (this.value) {
            this.select?.writeValue(this.value);
            this.isBlackTick = this.determineBlackTick(this.value.toString());
        }

        this.palette =
            this.colorPalette || this.colors.map((color) => ({ color }));

        this.initOverlayUtilities();

        this.select.valueSelected
            .pipe(
                tap((value) => this.writeValue(value as any)),
                tap((value) => this.onChange(value)),
                takeUntil(this.destroy$)
            )
            .subscribe((value) => {
                if (value) {
                    this.isBlackTick = this.determineBlackTick(
                        value.toString()
                    );
                }
            });

        const positions = getOverlayPositions();

        const positionStrategy = this.cdkOverlay
            .position()
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
            maxWidth: this.cols
                ? this.cols * BOX_WIDTH_PX + CONTAINER_SIDE_PADDINGS_PX + "px"
                : "260px",
            positionStrategy,
        };
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onChange(value: any): void {}

    _onTouched(): void {}

    public writeValue(value: string | IOptionValueObject): void {
        this.value = value;
        this.select?.writeValue(value);
    }

    public registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    public setStyles = (color: string): Record<string, any> => ({
        "background-color": color || this.defaultColor,
    });

    public determineBlackTick(color: string): boolean {
        let hexColorValue = "#fff";

        if (this.colorService.isHEX(color)) {
            hexColorValue = color;
        } else {
            hexColorValue =
                getColorValueByName(color) ||
                this.colorService.RGBToHexRGBToHex(color) ||
                this.colorService.colorKeywordsToHex(color);
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
            this.selectResizeObserver.unobserve(
                this.select.elRef.nativeElement
            );
        });
    }

    // convert hex code to rgb and compare the contrast of pure black and pure white on bgColor
    private getContrastOnBgColor(bgColor: string) {
        if (!bgColor) {
            return "";
        }

        return parseInt(bgColor.replace("#", ""), 16) > 0xffffff / 2
            ? "#fff"
            : "#000";
    }
}
