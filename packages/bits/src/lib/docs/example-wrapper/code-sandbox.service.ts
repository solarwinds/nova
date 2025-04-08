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

import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, Optional } from "@angular/core";
import { compressToBase64 } from "lz-string";

import { createAngularApp } from "./code-sandbox-files";
import { DEMO_PATH_TOKEN } from "../../../constants/path.constants";

/** @dynamic */
@Injectable({
    providedIn: "root",
})
export class CodeSandboxService {
    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Optional() @Inject(DEMO_PATH_TOKEN) private config: any
    ) {}

    async open(prefix: string, sources: any): Promise<void> {
        async function mainVersion(packageName: string) {
            // only fetch tiny-tarball
            const res = await fetch(
                "https://registry.npmjs.org/" + packageName,
                {
                    headers: new Headers({
                        Accept: "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*",
                    }),
                }
            );
            const json = await res.json();
            return json["dist-tags"].latest;
        }

        const form: HTMLFormElement = this.document.createElement("form");

        const latestNovaVersion = await mainVersion("@nova-ui/bits");
        const packageJson = await import("../../../../../../package.json");
        const packageLib = await import("../../../../package.json");
        const files = createAngularApp(
            prefix,
            this.config.context,
            sources,
            packageJson.default,
            packageLib.default,
            latestNovaVersion
        );
        // TODO fix modification of less files
        // const modifySources = (source: string) => // Handle non-existent less references that are just killing plunker
        //     source.replace(/^.*@import \(reference\).*$/gm, "/* NUI LESS VARIABLES ARE NOT SUPPORTED YET */");

        // TODO add support for translations
        // form.append(this.formInput("translations", "ts", translations));

        form.style.display = "none";
        form.setAttribute("method", "POST");
        form.setAttribute(
            "action",
            "https://codesandbox.io/api/v1/sandboxes/define"
        );
        form.setAttribute("target", "_blank");

        const parameters = this.compress(files);
        this.addHiddenInput(form, "parameters", parameters);

        this.document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    addHiddenInput(form: HTMLFormElement, name: string, value: any): void {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    compress(object: Record<string, object>): string {
        return compressToBase64(JSON.stringify(object))
            .replace(/\+/g, "-") // Convert '+' to '-'
            .replace(/\//g, "_") // Convert '/' to '_'
            .replace(/=+$/, ""); // Remove ending '='
    }
}
