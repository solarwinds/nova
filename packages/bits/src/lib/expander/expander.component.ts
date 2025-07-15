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
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  input
} from "@angular/core";

import { expandV2 } from "../../animations/expand";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";

/**
 * <example-url>./../examples/index.html#/expander</example-url>
 */
@Component({
    selector: "nui-expander",
    templateUrl: "./expander.component.html",
    animations: [expandV2],
    styleUrls: ["./expander.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class ExpanderComponent implements AfterContentInit {
    /**
     * Adds "disabled" attribute to expander
     */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() disabled: boolean = false;
    /**
     * Adds icon to expander's header
     */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() icon: string = "";
    /**
     * Adds title to expander's header
     */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() header: string = "";
    /**
     * Hides left dotted border of expander.
     */
    readonly hideLeftBorder = input<boolean>(false);
    /**
     * Use this to have expander opened by default.
     */
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() set open(value: boolean) {
        const previousValue: boolean = this.state === "expanded";
        if (previousValue !== value) {
            this.state = value ? "expanded" : "collapsed";
        }
    }

    get open(): boolean {
        return this.state === "expanded";
    }
    /**
     * Is emitted when expander is expanded/collapsed
     */
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild("customHeaderContent", { static: true })
    public customHeaderContent: ElementRef;

    public state: "expanded" | "collapsed" = "collapsed";
    public isCustomHeaderContentEmpty: boolean = false;

    private actionKeys = [KEYBOARD_CODE.SPACE, KEYBOARD_CODE.ENTER].map(String);

    constructor(private cdRef: ChangeDetectorRef) {}

    public ngAfterContentInit(): void {
        this.isCustomHeaderContentEmpty =
            this.customHeaderContent.nativeElement.childNodes.length === 0;
    }

    public toggle(): void {
        if (!this.disabled) {
            this.open = !this.open;
            this.openChange.emit(this.open);
            this.cdRef.detectChanges();
        }
    }

    public getIconColor(): string {
        return this.disabled ? "gray" : "primary-blue";
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (this.actionKeys.includes(event.code)) {
            if (event.target === event.currentTarget) {
                event.preventDefault();
                this.toggle();
            }
        }
    }
}
