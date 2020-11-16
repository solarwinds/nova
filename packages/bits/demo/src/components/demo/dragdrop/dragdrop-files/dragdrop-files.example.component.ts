import { Component } from "@angular/core";

import { FileDropState } from "../file-drop/public-api";

@Component({
    selector: "nui-dragdrop-files-example",
    templateUrl: "./dragdrop-files.example.component.html",
    styleUrls: ["./dragdrop-files.example.component.less"],
})
export class DragdropFilesExampleComponent {

    public gifError = false;
    public imageType = "image/gif";

    public fileDropState = FileDropState.default;

    public files: File[] = [];

    dropHandler(ev: DragEvent) {

        if (!ev.dataTransfer) {
            throw new Error("dataTransfer is not defined");
        }
        this.files.push(
            ...this.extractFilesFromDropEventData(ev.dataTransfer)
                    .filter((file: File) => this.validateDataType(file.type))
        );

        this.invalidateFiles();
    }

    onFileRead(ev: Event) {
        const files: FileList | null = (ev.target as HTMLInputElement).files;
        if (!files) {
            throw new Error("fileList is not defined");
        }
        // no validation here since we have native one in browser input
        this.files.push(...Array.from(files));
    }

    dragEnterHandler(ev: DragEvent) {
        // This naively checks only first file

        if (ev.dataTransfer && ev.dataTransfer.items) {
            this.gifError = !this.validateDataType(ev.dataTransfer.items[0].type);
        }

        this.fileDropState = this.gifError ? FileDropState.error : FileDropState.active;
    }

    invalidateFiles() {
        // Change it if you want to have some error highlight even after dragLeave
        this.fileDropState = FileDropState.default;
        this.gifError = false;
    }

    rmFile(fileInput: File) {
        this.files = this.files.filter(file => file !== fileInput);
    }

    private validateDataType(dataType: string) {
        return dataType.includes(this.imageType);
    }

    // TODO: this can be extracted to a service
    private extractFilesFromDropEventData(data: DataTransfer): File[] {
        const files: File[] = [];
        if (data.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < data.items.length; i++) {
                // If dropped items aren't files, reject them
                if (data.items[i].kind === "file") {
                    const file: File | null = data.items[i].getAsFile();
                    if (file) {
                        files.push(file);
                    }
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s) for Safari
            for (let i = 0; i < data.files.length; i++) {
                files.push(data.files[i]);
            }
        }
        return files;
    }

}
