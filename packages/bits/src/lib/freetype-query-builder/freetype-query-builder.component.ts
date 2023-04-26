import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { FreeTypeQueryUtilsService } from "./helpers/freetype-query-utils.service";
import {
    CaretCoordinates,
    HelpEntry,
    HintEntry,
    QueryToken,
    RenderConfigurator,
    Tokenizer,
} from "./models";
import { TextHighlightOverlayComponent } from "./text-highlight-overlay/text-highlight-overlay-component";
import { NuiFormFieldControl } from "../form-field/public-api";
import { OptionValueType } from "../overlay/types";
import { SelectV2Component } from "../select-v2/select/select-v2.component";
import { ToastService } from "../toast/toast.service";

@Component({
    selector: "nui-freetype-query-builder",
    templateUrl: "./freetype-query-builder.component.html",
    styleUrls: ["./freetype-query-builder.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => FreetypeQueryComponent),
        },
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => FreetypeQueryComponent),
            multi: true,
        },
    ],
})
export class FreetypeQueryComponent<T extends QueryToken>
    implements OnChanges, OnDestroy, AfterViewInit
{
    private static pasteTextCommon(text: string): boolean {
        text = text.replace(/(\r\n|\n|\r)/gm, " ");

        return document.execCommand("insertText", false, text);
    }

    private readonly KEY_ENTER_CODE = "Enter";
    private readonly KEY_ESC_CODE = "Escape";

    @Input()
    maxLength: number = 10_000;
    @Input()
    readonly: boolean = false;
    @Input()
    placeholder: string;
    @Input()
    value: string;
    @Input()
    renderer: RenderConfigurator<T>;
    @Input()
    tokenizer: Tokenizer<T>;
    @Input()
    currentHelp: HelpEntry[] = [];
    @Input()
    cursorSetter$: Observable<any>;
    @Output()
    helpItemSelected = new EventEmitter<{ value: string }>();
    @Output()
    currentValue = new EventEmitter<{ value: string; tokens: T[] }>();
    @Output()
    cursorPos = new EventEmitter<number>();
    @Output()
    cursorCoords = new EventEmitter<CaretCoordinates>();
    @Output()
    submitQuery = new EventEmitter();

    @ViewChild("queryselect", { static: true })
    querySelect: SelectV2Component;
    @ViewChild("messageTextarea", { static: false })
    messageTextarea: ElementRef;
    @ViewChild("messageTextareaHolder", { static: false })
    messageTextareaHolder: ElementRef;
    @ViewChild("textHighlightOverlayHolder", { static: false })
    textHighlightOverlayHolder: ElementRef;
    @ViewChild(TextHighlightOverlayComponent, { static: false })
    textHighlightOverlay: ElementRef;

    private readonly ON_SCROLL_CALLBACK = this.onTextAreaScroll.bind(this);
    private readonly BASE_LINE = 34;
    private destroy$$ = new Subject<void>();
    private tokens: T[] = [];
    private scrollValue: number = 0;
    private cursorPosition = 0;
    private bodyControl: FormControl;
    private focusedToken: T;
    private lastHeight: number = 0;

    formGroup: FormGroup;
    focusedTokenValue = "";
    highlightModel: { value: string; tokens: T[] } = { value: "", tokens: [] };
    inputHeight = this.BASE_LINE;
    public selectControl: FormControl = new FormControl();

    constructor(
        private renderer2: Renderer2,
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        private toastService: ToastService,
        private utils: FreeTypeQueryUtilsService
    ) {
        this.formGroup = this.formBuilder.group({
            body: [""],
        });
        this.bodyControl = this.formGroup.get("body") as FormControl;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.bodyControl.patchValue(changes.value.currentValue);
        }
    }

    ngAfterViewInit(): void {
        this.renderer2.listen(
            this.querySelect.inputElement.nativeElement,
            "focusin",
            () => {
                this.openOptions();
            }
        );
        this.querySelect.valueSelected
            .pipe(takeUntil(this.destroy$$))
            .subscribe((value: OptionValueType) => {
                this.itemSelected({
                    newValue: value as HintEntry,
                    oldValue: undefined,
                });
                setTimeout(() => {
                    this.openOptions();
                });
            });

        this.bodyControl.valueChanges
            .pipe(takeUntil(this.destroy$$))
            .subscribe((value) => this.onValueChange(value));
        this.registerListeners();
        this.cursorSetter$
            .pipe(takeUntil(this.destroy$$))
            .subscribe((pos) => setTimeout(() => this.setCursorToPos(pos)));
        if (this.value) {
            this.onValueChange(this.value);
            setTimeout(() => {
                this.rerender();
            });
        }
        this.querySelect.clickOutsideDropdown.subscribe(() => {
            this.querySelect.hideDropdown();
        });

        this.renderer2.listen(
            this.querySelect.inputElement.nativeElement,
            "focusout",
            ($event) => {
                const selectedOption =
                    this.querySelect.inputElement.nativeElement.parentElement.contains(
                        $event.currentTarget.parentElement
                    );
                if (!selectedOption) {
                    setTimeout(() => this.querySelect.hideDropdown());
                }
            }
        );
    }

    private openOptions() {
        if (!this.querySelect.isDropdownOpen) {
            this.selectControl.setValue(undefined);
            this.querySelect.showDropdown();
        }
    }

    ngOnDestroy(): void {
        this.clearListeners();
        this.destroy$$.next();
        this.destroy$$.complete();
    }

    onKeyDown($event: KeyboardEvent): void {
        if ($event.key === this.KEY_ENTER_CODE) {
            $event.preventDefault();
            if (!this.querySelect.isDropdownOpen) {
                this.submitQuery.emit();
            }
        }
    }

    onDrop($event: DragEvent): void {
        const data = $event.dataTransfer?.getData("text");
        if (data && data.length + this.value.length > this.maxLength) {
            $event.preventDefault();
            this.toastService.error({
                message:
                    "Query cannot exceed maximum length of " +
                    this.maxLength +
                    " characters.",
            });
        }
    }

    onKeyUp($event: KeyboardEvent): void {
        if ($event.key !== this.KEY_ENTER_CODE) {
            this.updateCursor(
                ($event.target as HTMLTextAreaElement)["selectionStart"]
            );
        }
        if ($event.key !== this.KEY_ESC_CODE) {
            this.openOptions();
        }

        if ($event.key === this.KEY_ESC_CODE) {
            this.querySelect.hideDropdown();
        }
    }

    onClick($event: MouseEvent): void {
        this.updateCursor(
            ($event.target as HTMLTextAreaElement)["selectionStart"]
        );
        this.openOptions();
    }

    itemSelected($event: {
        newValue: HintEntry;
        oldValue: HintEntry | undefined;
    }): void {
        this.helpItemSelected.emit({ value: $event.newValue.value });
    }

    private get textarea(): HTMLTextAreaElement {
        return this.messageTextarea.nativeElement;
    }

    private get textareaHolder(): HTMLElement {
        return this.messageTextareaHolder.nativeElement;
    }

    private clearNewLinesOnPaste = (event: ClipboardEvent): void => {
        event.preventDefault();
        if (event.clipboardData && event.clipboardData.getData) {
            const text = event.clipboardData.getData("text/plain");
            if (!FreetypeQueryComponent.pasteTextCommon(text)) {
                this.pasteTextFirefox(this.textarea, text);
            }
            this.scrollToCursor();
        }
    };

    private scrollToCursor(): void {
        setTimeout(() => {
            this.textarea.blur();
            this.textarea.focus();
        });
    }

    private pasteTextFirefox(
        textarea: HTMLTextAreaElement,
        text: string
    ): void {
        textarea.setRangeText(
            text,
            textarea.selectionStart || 0,
            textarea.selectionEnd || 0,
            "end"
        );
        if (textarea.value.length > this.maxLength) {
            textarea.value = textarea.value.substr(0, this.maxLength);
        }
        // @ts-ignore
        textarea.dispatchEvent(
            new InputEvent("input", {
                data: text,
                inputType: "insertText",
                isComposing: false,
            })
        );
    }

    private onTextAreaScroll(event: Event): void {
        this.scrollValue = (event.target as HTMLElement)["scrollTop"];
        this.textHighlightOverlayHolder.nativeElement.scrollTop =
            this.scrollValue;
        this.cd.markForCheck();
    }

    private onValueChange(value: string): void {
        this.value = value;
        this.tokens = this.tokenizer.tokenizeText(this.bodyControl.value);
        this.focusedToken = this.tokens[this.getFocusedTokenIndex()];
        this.focusedTokenValue = this.focusedToken
            ? this.focusedToken.value
            : "";
        this.openOptions();
        this.rerender();
        this.currentValue.emit({ value: this.value, tokens: this.tokens });
    }

    private setCursorToPos(pos: number): void {
        this.textarea.focus();
        this.textarea.setSelectionRange(pos, pos);
    }

    private rerender(): void {
        this.textarea.style.height =
            this.textHighlightOverlay["container" as keyof ElementRef]
                .scrollHeight + "px";
        this.highlightModel = { value: this.value, tokens: this.tokens };
        setTimeout(() => {
            const overlayScrollHeight =
                this.textHighlightOverlay["container" as keyof ElementRef]
                    .scrollHeight;
            this.highlightModel = { value: this.value, tokens: this.tokens };
            this.textarea.style.height = overlayScrollHeight + "px";

            if (this.textAreaHeightChanged()) {
                this.lastHeight = overlayScrollHeight;
                if (document.activeElement === this.textarea) {
                    this.openOptions();
                }
            }
            this.cd.detectChanges();
        });
    }

    private getFocusedTokenIndex(): number {
        for (let i = 0; i < this.tokens.length; i++) {
            if (
                this.tokens[i].start <= this.cursorPosition &&
                this.tokens[i].end >= this.cursorPosition
            ) {
                return i;
            }
        }

        return -1;
    }

    private updateCursor(selectionStart: number): void {
        this.cursorPos.emit(selectionStart);
        this.cursorPosition = selectionStart;
        const focusedTokenIndex = this.getFocusedTokenIndex();
        this.focusedToken =
            this.tokens[
                focusedTokenIndex < 0
                    ? this.tokens.length - 1
                    : focusedTokenIndex
            ];
        this.focusedTokenValue = this.focusedToken
            ? this.focusedToken.value
            : "";
        this.tokens.forEach((token) => {
            token.focused =
                token.start <= this.cursorPosition &&
                token.end >= this.cursorPosition;
        });
        this.rerender();
        this.cursorCoords.emit(
            this.utils.getTextareaCaretCoordinates(
                this.textarea,
                this.textarea.selectionEnd
            )
        );
    }

    private textAreaHeightChanged(): boolean {
        return (
            Number(this.textarea.style.height.split("px")[0]) !==
            this.lastHeight
        );
    }

    private registerListeners(): void {
        const textAreaEl = this.textareaHolder;
        if (textAreaEl) {
            textAreaEl.addEventListener("scroll", this.ON_SCROLL_CALLBACK);
            textAreaEl.addEventListener("paste", this.clearNewLinesOnPaste);
        }
    }

    private clearListeners(): void {
        const textAreaEl = this.textareaHolder;
        if (textAreaEl) {
            textAreaEl.removeEventListener("scroll", this.ON_SCROLL_CALLBACK);
            textAreaEl.removeEventListener("paste", this.clearNewLinesOnPaste);
        }
    }
}
