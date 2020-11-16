import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ContentChildren,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    Renderer2,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";

import { ResizeDirection, ResizeUnit } from "../../../common/directives/resizer/public-api";
import { LayoutResizerComponent } from "../layout-resizer/layout-resizer.component";
import { ILayoutElementDirection, ISheetType } from "../public-api";
import { SheetComponent } from "../sheet/sheet.component";


type Element = SheetComponent | SheetGroupComponent;
interface IElementInfo {
    item: Element;
    value: string;
}

// <example-url>./../examples/index.html#/layout</example-url>
@Component({
    selector: "nui-sheet-group",
    templateUrl: "./sheet-group.component.html",
    host: { "class": "nui-sheet-group" },
    styleUrls: ["./sheet-group.component.less"],
})
export class SheetGroupComponent implements OnInit, AfterViewInit, OnDestroy {
    /**
     * Set whether the child elements can be resizable.
     */
    @HostBinding("class.nui-sheet-group--resizable")
    @Input() isResizable: boolean;

    /**
     * Set resize unit of child elements(pixel, percent). By default pixels are used.
     */
    @Input() resizeUnit = ResizeUnit.pixel;

    /**
     * Determines the way sheets links each other. Can be 'joined' or 'separate'.
     */
    @Input() sheetsType: ISheetType = "joined";

    /**
     * Direction of layout elements. Can be 'row' or 'column'.
     */
    @Input() direction: ILayoutElementDirection = "row";
    /**
    * Value for flexBasis of SheetComponent or SheetGroupComponent.
    * Can be in 'px' or '%'
    */
    @Input() initialSizeValue: string;

    @HostBinding("class.nui-sheet-group--joined-sheets") applyJoinedSheetsClass: boolean;
    @HostBinding("class.nui-sheet-group--separate-sheets") applySeparateSheetsClass: boolean;

    @HostBinding("class.sheet-group-direction-column") applyDirectionColumnClass = false;
    @HostBinding("class.sheet-group-direction-row") applyDirectionRowClass = true;

    @ViewChild("resizerPlaceholder", { read: ViewContainerRef }) public resizerPlaceholder: ViewContainerRef;
    @ContentChildren(SheetComponent) sheetList: QueryList<SheetComponent>;
    @ContentChildren(SheetGroupComponent, { descendants: false }) sheetGroupList: QueryList<SheetGroupComponent>;

    public resizersList: ComponentRef<any>[] = [];
    public resizeDirection: ResizeDirection;

    // workaround for issue when @ContentChildren can select host component - https://github.com/angular/angular/issues/10098;
    // TODO: remove when it'll be fixed in Ivy
    private filterGroups(sheetGroupList: any) {
        return sheetGroupList.filter((group: SheetGroupComponent) => group !== this);
    }

    public addResizers(resizableList: QueryList<any>) {
        resizableList.forEach((resizableItem, index) => {
            if (index === resizableList.length - 1) {
                return;
            }
            this.appendResizer(LayoutResizerComponent, resizableItem);
        });
        // make it such that it's valid even when resizer isn't added
        this.calculateFlexBasis(resizableList, resizableList.length);
    }

    public appendResizer(factory: any, resizeEl: any) {
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(factory);

        const ref = this.resizerPlaceholder.createComponent(componentRef);
        (<LayoutResizerComponent>ref.instance).resizeElement = resizeEl;
        (<LayoutResizerComponent>ref.instance).resizeDirection = this.resizeDirection;
        (<LayoutResizerComponent>ref.instance).resizeUnit = this.resizeUnit;
        (<LayoutResizerComponent>ref.instance).enableSeparateOffsetSize = this.sheetsType === "separate";
        ref.changeDetectorRef.detectChanges();
        this.resizersList.push(ref);
    }

    public calculateFlexBasis(resizableList: QueryList<Element>, numOfItems: number) {
        let availableSpace: string = "100%";
        const hasInitSize = resizableList.some((element: Element) => !!element.initialSizeValue);
        const fitContent = resizableList.some((element: Element) => !!(element as any).fitContent);
        const itemsToRender: IElementInfo[] = [];
        let itemsWithSize: Element[];
        let itemsWithoutSize: Element[];

        if (hasInitSize) {
            // calculation for init size
            // filter element so that those with size are dealt with first
            itemsWithSize = resizableList.filter((element: Element) => !!element.initialSizeValue && !(element as any).fitContent);
            itemsWithoutSize = resizableList.filter((element: Element) => !element.initialSizeValue && !(element as any).fitContent);

            itemsWithSize.forEach((element: Element) => {
                availableSpace = `(${availableSpace} - ${element.initialSizeValue})`;
                itemsToRender.push({ item: element, value: `${element.initialSizeValue}` });
                numOfItems--;
            });
            itemsWithoutSize.forEach((element: Element) => {
                availableSpace = `${availableSpace} / ${numOfItems}`;
                itemsToRender.push({ item: element, value: availableSpace });
                numOfItems--;
            });
        } else if (!fitContent) {
            // normal flow of calculation
            resizableList.forEach((resizableItem: Element) => {
                itemsToRender.push({ item: resizableItem, value: `${availableSpace} / ${numOfItems}` });
            });
        }

        // rendering of calculation
        itemsToRender.forEach(({ item, value }) => {
            this.renderer.setStyle(item.elRef.nativeElement, "flexBasis", `calc(${value})`);
        });
    }

    constructor(public elRef: ElementRef,
        private renderer: Renderer2,
        private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnInit() {
        this.applyJoinedSheetsClass = (this.applyJoinedSheetsClass && !this.applySeparateSheetsClass) || this.sheetsType === "joined";
        this.applySeparateSheetsClass = (!this.applyJoinedSheetsClass && this.applySeparateSheetsClass) || this.sheetsType === "separate";
        this.applyDirectionColumnClass = this.direction === "column";
        this.applyDirectionRowClass = this.direction === "row";
        this.resizeDirection = this.direction === "row" ? ResizeDirection.right : ResizeDirection.bottom;
    }

    ngAfterViewInit() {
        // 2 addResizers needed for correct handling sheetGroups and sheets elements,
        // f.e. flex basis calculation or detection last element of correspondent type
        if (this.isResizable) {
            this.addResizers(this.sheetList);
            this.addResizers(this.filterGroups(this.sheetGroupList));
        } else {
            this.calculateFlexBasis(this.sheetList, this.sheetList.length);
            this.calculateFlexBasis(this.filterGroups(this.sheetGroupList), this.filterGroups(this.sheetGroupList).length);
        }
    }

    ngOnDestroy() {
        if (this.resizersList.length > 0) {
            this.resizersList.forEach((resizer) => {
                resizer.destroy();
            });
        }
    }
}
