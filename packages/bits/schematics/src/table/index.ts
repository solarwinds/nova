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
    branchAndMerge,
    chain,
    filter,
    mergeWith,
    move,
    Rule,
    SchematicsException,
    template,
    Tree,
    url,
} from "@angular-devkit/schematics";
import { addExportToModule } from "@schematics/angular/utility/ast-utils";
import { InsertChange } from "@schematics/angular/utility/change";
import {
    buildRelativePath,
    findModuleFromOptions,
} from "@schematics/angular/utility/find-module";
import { parseName } from "@schematics/angular/utility/parse-name";
import { validateHtmlSelector } from "@schematics/angular/utility/validation";

import { buildDefaultPath, getProject } from "../utility/project";
import {
    buildSelector,
    readIntoSourceFile,
    updateModuleChanges,
} from "../utility/schematics-helper";
import { Schema as ComponentOptions } from "./schema";

function addDeclarationToNgModule(options: ComponentOptions): Rule {
    return (host: Tree) => {
        if (options.skipImport || !options.module) {
            return host;
        }

        const modulePath = options.module;
        let moduleSource = readIntoSourceFile(host, modulePath);

        const componentPath =
            `/${options.path}/` +
            (options.flat ? "" : strings.dasherize(options.name) + "/") +
            strings.dasherize(options.name) +
            ".component";
        const relativePath = buildRelativePath(modulePath, componentPath);
        const componentName = strings.classify(`${options.name}Component`);

        // default modules to be imported
        const modules = [
            { item: "NuiTableModule", path: "@nova-ui/bits" },
            { item: "NuiIconModule", path: "@nova-ui/bits" },
        ];

        if (options.dataSource === "serverSide") {
            modules.push({
                item: "HttpClientModule",
                path: "@angular/common/http",
            });
            if (options.pagingMode === "none") {
                throw new Error(
                    "Cannot display serverSide dataSource without a pagingMode"
                );
            }
        }

        // additional module(s) used only for search functionality
        if (options.enableSearch) {
            modules.push({ item: "NuiSearchModule", path: "@nova-ui/bits" });
        }

        // additional module(s) used only for pagination functionality
        if (options.pagingMode === "pagination") {
            modules.push({ item: "NuiPaginatorModule", path: "@nova-ui/bits" });
        } else if (options.pagingMode === "virtualScroll") {
            modules.push({
                item: "ScrollingModule",
                path: "@angular/cdk/scrolling",
            });
            modules.push({ item: "NuiProgressModule", path: "@nova-ui/bits" });
        }

        updateModuleChanges(
            host,
            options,
            moduleSource,
            modules,
            [],
            [{ item: componentName, path: relativePath }]
        );

        if (options.export) {
            // Need to refresh the AST because we overwrote the file in the host.
            moduleSource = readIntoSourceFile(host, modulePath);

            const exportRecorder = host.beginUpdate(modulePath);
            const exportChanges = addExportToModule(
                moduleSource,
                modulePath,
                strings.classify(`${options.name}Component`),
                relativePath
            );

            for (const change of exportChanges) {
                if (change instanceof InsertChange) {
                    exportRecorder.insertLeft(change.pos, change.toAdd);
                }
            }

            host.commitUpdate(exportRecorder);
        }

        return host;
    };
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
        options.selector =
            options.selector || buildSelector(options, project.prefix);
        options.dataSourceName = options.dataSourceName || options.name;

        validateHtmlSelector(options.selector);

        const templateSource = apply(url("./files"), [
            template({
                ...strings,
                "if-flat": (s: string) => (options.flat ? "" : s),
                ...options,
            }),
            filter((path: string) => {
                if (
                    options.virtualScrollStrategy !== "custom" &&
                    path.endsWith("virtual-scroll-custom-strategy.service.ts")
                ) {
                    return false;
                }

                if (
                    options.dataSource === "custom" &&
                    (path.endsWith("data-source.service.ts") ||
                        path.endsWith("types.ts"))
                ) {
                    return false;
                }

                if (
                    (options.dataSource === "none" ||
                        options.dataSource === "clientSide") &&
                    path.endsWith("data-source.service.ts")
                ) {
                    return false;
                }

                return (
                    options.dataSourceName === options.name ||
                    (options.dataSourceName !== options.name &&
                        !path.endsWith("data-source.service.ts") &&
                        !path.endsWith("types.ts") &&
                        !path.endsWith("data.ts"))
                );
            }),
            move(`${parsedPath.path}/${parsedPath.name}`),
        ]);

        return chain([
            branchAndMerge(
                chain([
                    addDeclarationToNgModule(options),
                    mergeWith(templateSource),
                ])
            ),
        ]);
    };
}
