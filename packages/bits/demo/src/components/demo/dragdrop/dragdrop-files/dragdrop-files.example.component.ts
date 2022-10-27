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
            ...this.extractFilesFromDropEventData(ev.dataTransfer).filter(
                (file: File) => this.validateDataType(file.type)
            )
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
            this.gifError = !this.validateDataType(
                ev.dataTransfer.items[0].type
            );
        }

        this.fileDropState = this.gifError
            ? FileDropState.error
            : FileDropState.active;
    }

    invalidateFiles() {
        // Change it if you want to have some error highlight even after dragLeave
        this.fileDropState = FileDropState.default;
        this.gifError = false;
    }

    rmFile(fileInput: File) {
        this.files = this.files.filter((file) => file !== fileInput);
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
