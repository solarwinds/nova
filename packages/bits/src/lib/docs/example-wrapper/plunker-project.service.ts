import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

import { PlunkerFiles } from "./plunker-files";

/** @dynamic */
@Injectable({
    providedIn: "root",
})
export class PlunkerProjectService {
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private plunkerFiles: PlunkerFiles
    ) {}

    public open(prefix: any, sources: any, translations?: any): void {
        const form: HTMLFormElement = this.document.createElement("form");

        const modifySources = (source: string) =>
            // Handle non-existent less references that are just killing plunker
            source.replace(/^.*@import \(reference\).*$/mg, "// NUI LESS VARIABLES ARE NOT SUPPORTED YET");

        // example files
        Object.keys(sources).forEach( key => {
            form.append(
                this.formInput(
                    `${prefix}.example.component`,
                    key,
                    modifySources(sources[key])
                )
            );
        });

        // translations
        form.append(this.formInput("translations", "ts", translations));

        // application files
        form.append(this.getMainTSInput());
        form.append(this.getConfigJSInput());
        form.append(this.getIndexHTMLInput());
        form.append(this.getAppComponentTSInput(prefix, sources.ts));

        form.style.display = "none";
        form.setAttribute("method", "post");
        form.setAttribute("action", "http://plnkr.co/edit/?p=preview");
        form.setAttribute("target", "_blank");

        this.document.body.append(form);
        form.submit();
        form.remove();
    }

    public getIndexHTMLInput(): HTMLInputElement {
        return this.formInput("index", "html", this.plunkerFiles.getIndexFile());
    }

    public getMainTSInput(): HTMLInputElement {
        return this.formInput("main", "ts", this.plunkerFiles.getMainFile());
    }

    public getConfigJSInput(): HTMLInputElement {

        return this.formInput("config", "js", this.plunkerFiles.getSystemJsConfigFile());
    }

    public getAppComponentTSInput(filePrefix: string, fileContent: string): HTMLInputElement {
        const className: string | undefined = this.getClassName(fileContent);
        const selectorName: string | undefined = this.getSelectorName(fileContent);

        if (!className) {
            throw new Error("Provided file should contain a class");
        }

        if (!selectorName) {
            throw new Error("Provided file should contain selector");
        }

        return this.formInput("app", "ts", this.plunkerFiles.getAppFile(filePrefix, className, selectorName));
    }

    private formInput(prefixName: string, extName: string, content: string): HTMLInputElement {
        const inputEl: HTMLInputElement = this.document.createElement("input");
        inputEl.setAttribute("type", "hidden");
        inputEl.setAttribute("name", `files[${prefixName}.${extName}]`);
        inputEl.setAttribute("value", `${content}`);

        return inputEl;
    }

    private getClassName(fileContent: string): string | undefined {
        const matches: RegExpMatchArray | null = fileContent.match(/export class (\w+Component)/);
        return (matches || [])[1]; // capture exported component name
    }
    private getSelectorName(fileContent: string): string | undefined {
        const matches: RegExpMatchArray | null = fileContent.match(/selector: \"(.*)\"/);
        return (matches || [])[1]; // capture selector
    }
}
