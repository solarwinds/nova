import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";
import {Component, OnInit, TemplateRef, ViewContainerRef, ViewEncapsulation} from "@angular/core";
import {DialogService, ITimeframe, NuiDialogRef, ToastService} from "@nova-ui/bits";
import moment from "moment/moment";

@Component({
    selector: "nui-dialog-zindex--test",
    templateUrl: "./dialog-zindex-test.component.html",
    styleUrls: ["./dialog-zindex-test.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class DialogZIndexTestComponent implements OnInit {
    public busy: boolean = false;
    public appendToBody: boolean = false;

    public timeFrame: ITimeframe;

    public dt = moment("2018-02-02");
    public items = ["Long description item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"];
    public longTextTooltip = `
    which should appear on top of any other components (popup, popover, menu,etc.) even if it's displayed after the popover has been displayed.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam maximus faucibus bibendum.
    Aenean feugiat interdum leo sed posuere. Etiam at pulvinar enim, nec interdum purus.
    Pellentesque sit amet semper ipsum, eu vulputate tortor. Aliquam vitae nisi augue.
    Duis non erat sit amet sem venenatis accumsan at ullamcorper lorem. Morbi non turpis nibh.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam maximus faucibus bibendum.
    Duis non erat sit amet sem venenatis accumsan at ullamcorper lorem. Morbi non turpis nibh.
    `;

    private activeDialogs: NuiDialogRef[] = [];
    private overlayRef: OverlayRef;
    private baseDate = moment([2018, 5, 1, 15, 0, 0]);

    constructor(private dialogService: DialogService,
                private toastService: ToastService,
                private overlay: Overlay,
                private viewContainerRef: ViewContainerRef
    ) {}

    public ngOnInit(): void {
        this.timeFrame = {
            startDatetime: this.baseDate.clone().subtract(1, "weeks"),
            endDatetime: this.baseDate.clone(),
        };
    }

    public toggleBusy() {
        this.busy = !this.busy;
    }

    public toggleAppendToBody() {
        this.appendToBody = !this.appendToBody;
    }

    public openOverlay(templateRef: TemplateRef<string>, width: string, height: string) {
        const positionStrategy = this.overlay.position().global()
            .centerHorizontally()
            .centerVertically();

        this.overlayRef = this.overlay.create({
            positionStrategy,
            hasBackdrop: true,
            panelClass: ["main-overlay-panel", "d-flex", "flex-column"],
            width: width,
            height: height,
            scrollStrategy: this.overlay.scrollStrategies.block(),

        });
        const portal = new TemplatePortal(templateRef, this.viewContainerRef);
        this.overlayRef.attach(portal);
    }

    public closeOverlay() {
        this.overlayRef.detach();
    }

    public openInnerDialog(templateRef: TemplateRef<string>) {
        this.activeDialogs.push(this.dialogService.open(templateRef, {windowClass: "inner-dialog"}));
    }

    public closeDialog() {
        this.activeDialogs.pop()?.close();
    }

    public showToast(): void {
        this.toastService.success({message: $localize`Sample toast displayed!`, title: $localize`Event`});
    }
}
