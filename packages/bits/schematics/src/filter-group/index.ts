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

import { strings } from "@angular-devkit/core";
import {
    apply,
    chain,
    mergeWith,
    move,
    noop,
    Rule,
    SchematicsException,
    template,
    Tree,
    url,
} from "@angular-devkit/schematics";
import { buildRelativePath, findModuleFromOptions } from "@schematics/angular/utility/find-module";
import { applyLintFix } from "@schematics/angular/utility/lint-fix";
import { getAppModulePath } from "@schematics/angular/utility/ng-ast-utils";
import { parseName } from "@schematics/angular/utility/parse-name";
import { validateHtmlSelector, validateName } from "@schematics/angular/utility/validation";

import { buildDefaultPath, getProject } from "../utility/project";
import { buildSelector, getBrowserProjectTargets, readIntoSourceFile, updateModuleChanges } from "../utility/schematics-helper";

import { Schema as ComponentOptions } from "./schema";

function addModule(host: Tree, options: any) {
    const projectTargets = getBrowserProjectTargets(host, options);

    const mainPath = projectTargets.options.main;
    const appModulePath = getAppModulePath(host, mainPath);
    const moduleSource = readIntoSourceFile(host, appModulePath);
    const modulePath = options.module;
    const importedModulePath = `/${options.path}/`
        + (options.flat ? "" : strings.dasherize(options.name) + "/")
        + strings.dasherize(options.name)
        + ".module";

    const relativePath = buildRelativePath(modulePath, importedModulePath);

    updateModuleChanges(host, options, moduleSource,
        [
            { item: `${strings.classify(options.name)}Module`, path: relativePath },
            { item: "BrowserAnimationsModule", path: "@angular/platform-browser/animations" },
        ],
        [{ item: "DatePipe", path: "@angular/common" }]
    );
}

export default function (options: ComponentOptions): Rule {
    return (host: Tree) => {
        if (!options.project) {
            throw new SchematicsException("Option (project) is required.");
        }

        const project = getProject(host, options.project);

        if (options.path === undefined) {
            options.path = buildDefaultPath(project);
        }

        options.module = findModuleFromOptions(host, options);

        const parsedPath = parseName(options.path, options.name);

        options.name = parsedPath.name;
        options.path = parsedPath.path;
        options.selector = options.selector || buildSelector(options, project.prefix);
        options.prefix = options.prefix ?? project.prefix;

        if (!options.skipImport) {
            addModule(host, options);
        }

        validateName(options.name);
        validateHtmlSelector(options.selector);

        const templateSource = apply(url("./files"), [
            template({
                ...strings,
                "if-flat": (s: string) => options.flat ? "" : s,
                ...options,
            }),
            move(parsedPath.path),
        ]);

        return chain([
            mergeWith(templateSource),
            options.lintFix ? applyLintFix(options.path) : noop(),
        ]);
    };
}
