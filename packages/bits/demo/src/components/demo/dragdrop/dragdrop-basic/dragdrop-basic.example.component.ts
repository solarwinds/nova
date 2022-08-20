import { Component, Inject } from "@angular/core";
import {
    IDropEvent,
    IDropValidator,
    IToastService,
    ToastService,
} from "@nova-ui/bits";

class IsStringValidator implements IDropValidator {
    isValidDropTarget(payload: any, isExternal: boolean): boolean {
        if (isExternal) {
            return false;
        }
        return typeof payload === "string";
    }
}

class IsObjectValidator implements IDropValidator {
    isValidDropTarget(payload: any): boolean {
        return typeof payload === "object";
    }
}

@Component({
    selector: "nui-dragdrop-validator-example",
    templateUrl: "./dragdrop-basic.example.component.html",
})
export class DragdropBasicExampleComponent {
    public draggableString = "this is a string";
    public draggableObj = {
        imma: "little",
        teapot: "short and stout",
    };
    public destObject: {};
    public destString: string;
    public destAnything: any;
    public draggableExcel =
        "<table>" +
        "<tr>" +
        "<th>thing1</th>" +
        "<th>thing2</th>" +
        "</tr>" +
        "<tr>" +
        "<td>jeff</td>" +
        "<td>4</td>" +
        "</tr>" +
        "<tr>" +
        "<td>john</td>" +
        "<td>8</td>" +
        "</tr>" +
        "</table>";
    public isStringValidator = new IsStringValidator();
    public isObjectValidator = new IsObjectValidator();

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    public onDropObject(dropEvent: IDropEvent) {
        this.toastService.info({ message: $localize`Drop object!` });
        this.destObject = dropEvent.payload;
    }

    public onDropString(dropEvent: IDropEvent) {
        this.toastService.info({ message: $localize`Drop string!` });
        this.destString = JSON.stringify(dropEvent.payload);
    }

    public onDropAnything(dropEvent: IDropEvent) {
        this.toastService.info({ message: $localize`Drop anything!` });
        this.destAnything = dropEvent.payload;
    }

    public onDragStart(event: DragEvent) {
        this.toastService.info({ message: $localize`Drag start` });
    }

    public onDragEnd(event: DragEvent) {
        this.toastService.info({ message: $localize`Drag end` });
    }

    public onDragOver(event: DragEvent) {
        this.toastService.info({
            message: $localize`Drag over`,
            options: { preventDuplicates: true },
        });
    }

    public onDragEnter(event: DragEvent) {
        this.toastService.info({ message: $localize`Drag enter` });
    }

    public onDragLeave(event: DragEvent) {
        this.toastService.info({ message: $localize`Drag leave` });
    }
}
