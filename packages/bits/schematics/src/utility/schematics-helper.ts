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
    parseJsonAst,
    JsonParseMode,
} from "@angular-devkit/core/src/json/parser";
import {
    JsonAstArray,
    JsonAstObject,
} from "@angular-devkit/core/src/json/parser_ast";
import {
    Rule,
    SchematicContext,
    SchematicsException,
} from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import { addImportToModule } from "@angular/cdk/schematics";
import {
    addDeclarationToModule,
    addProviderToModule,
    isImported,
} from "@schematics/angular/utility/ast-utils";
import { Change, InsertChange } from "@schematics/angular/utility/change";
import {
    NodeDependency,
    NodeDependencyType,
} from "@schematics/angular/utility/dependencies";
import { BrowserBuilderTarget } from "@schematics/angular/utility/workspace-models";
import ts from "typescript";

import {
    appendValueInAstArray,
    findPropertyInAstObject,
    insertPropertyInAstObjectInOrder,
} from "./json-utils";
import { getProject } from "./project";
import { getProjectTargets } from "./project-targets";
import { getWorkspace } from "./workspace";

export function updateJsonFile(
    host: Tree,
    context: SchematicContext,
    filename: string,
    propertyChain: string[],
    itemToAdd: any
): Tree {
    const lastProperty = propertyChain[propertyChain.length - 1];
    try {
        const source = host.read(<string>filename)?.toString("utf-8") ?? "";
        const sourceAstObj: JsonAstObject = parseJsonAst(
            source,
            JsonParseMode.CommentsAllowed
        ) as JsonAstObject;

        let targetObj: JsonAstObject, parentObj: JsonAstObject | undefined;

        targetObj = sourceAstObj;

        for (let i = 0; i < propertyChain.length; i++) {
            parentObj = targetObj;
            targetObj = <JsonAstObject>(
                findPropertyInAstObject(
                    <JsonAstObject>parentObj,
                    propertyChain[i]
                )
            );
        }

        const recorder = host.beginUpdate(filename);

        const targetArray = <JsonAstArray>(<any>targetObj);

        if (targetArray && Array.isArray(itemToAdd)) {
            if (
                targetArray.elements.every(
                    //  we don't want a double not equal here
                    // tslint:disable-next-line:triple-equals
                    (element) => element.value != itemToAdd
                )
            ) {
                const lastStyle =
                    targetArray.elements[targetArray.elements.length - 1];
                const lastStyleIndent = lastStyle
                    ? lastStyle.start.character
                    : 0;
                appendValueInAstArray(
                    recorder,
                    targetArray,
                    itemToAdd[0],
                    lastStyleIndent
                );
            } else {
                context.logger.info(
                    `️ ${filename} already contains ${lastProperty}`
                );
            }
        } else {
            if (
                parentObj?.properties.every(
                    // we don't want a double not equal here
                    // tslint:disable-next-line:triple-equals
                    (property) => property.key.value != lastProperty
                )
            ) {
                const lastItemIndent = parentObj.properties[0]
                    ? parentObj.properties[0].start.character
                    : 0;
                insertPropertyInAstObjectInOrder(
                    recorder,
                    parentObj,
                    lastProperty,
                    itemToAdd,
                    lastItemIndent
                );
            } else {
                context.logger.info(
                    `️ ${filename} already contains ${lastProperty}`
                );
            }
        }
        host.commitUpdate(recorder);
    } catch (ex) {
        context.logger.error(
            `🚫 Failed to update ${filename} with ${lastProperty}: ${ex.toString()}`
        );
    }
    context.logger.info(`✅️ Updated ${filename} with ${lastProperty}`);

    return host;
}

export function buildSelector(options: any, projectPrefix: string): string {
    let selector = strings.dasherize(options.name);

    if (options.prefix) {
        selector = `${options.prefix}-${selector}`;
    } else if (options.prefix === undefined && projectPrefix) {
        selector = `${projectPrefix}-${selector}`;
    }

    return selector;
}

export function readIntoSourceFile(
    host: Tree,
    modulePath: string
): ts.SourceFile {
    const text = host.read(modulePath);

    if (text === null) {
        throw new SchematicsException(`File ${modulePath} does not exist.`);
    }

    const sourceText = text.toString("utf-8");

    return ts.createSourceFile(
        modulePath,
        sourceText,
        ts.ScriptTarget.Latest,
        true
    );
}

export interface IModuleItem {
    item: string;
    path: string;
}

export function updateModuleChanges(
    host: Tree,
    options: any,
    moduleSource: ts.SourceFile,
    modules: IModuleItem[],
    providers: IModuleItem[] = [],
    declarations: IModuleItem[] = []
): void {
    const modulePath = options.module;

    const declarationRecorder = host.beginUpdate(modulePath);

    declarations.forEach((item: IModuleItem) => {
        const changeList = addDeclarationToModule(
            moduleSource,
            modulePath,
            item.item,
            item.path
        );
        changeList.forEach((change: Change) => {
            if (change instanceof InsertChange) {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        });
    });

    providers.forEach((item: IModuleItem) => {
        const changeList = addProviderToModule(
            moduleSource,
            modulePath,
            item.item,
            item.path
        );

        changeList.forEach((change: Change) => {
            if (change instanceof InsertChange) {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        });
    });

    modules.forEach((item: IModuleItem) => {
        if (!isImported(moduleSource, item.item, item.path)) {
            const moduleChanges = addImportToModule(
                moduleSource,
                modulePath,
                item.item,
                item.path
            );
            moduleChanges.forEach((change: Change) => {
                if (change instanceof InsertChange) {
                    declarationRecorder.insertLeft(change.pos, change.toAdd);
                }
            });
        }
    });

    host.commitUpdate(declarationRecorder);
}

export function getBrowserProjectTargets(
    host: Tree,
    options: any
): BrowserBuilderTarget {
    const workspace = getWorkspace(host);
    const clientProject = getProject(workspace, options.project);
    // @ts-ignore: Avoiding strict mode errors, preserving old behavior
    return getProjectTargets(clientProject)["build"];
}

export function addStylesToAngularJson(
    options: any,
    stylePaths: string[]
): Rule {
    return (host: Tree, context: SchematicContext): Tree =>
        updateJsonFile(
            host,
            context,
            "angular.json",
            [
                "projects",
                options.project,
                "architect",
                "build",
                "options",
                "styles",
            ],
            stylePaths
        );
}

export function installPackageJsonDependencies(): Rule {
    return (host: Tree, context: SchematicContext) => {
        context.addTask(new NodePackageInstallTask());
        context.logger.info(` Installing packages...`);
        return host;
    };
}

export function assembleDependencies(
    dependencies: Record<string, string>
): NodeDependency[] {
    return Object.keys(dependencies).map((key) => ({
        type: NodeDependencyType.Default,
        version: omitUpperPeerDependencyVersion(dependencies[key]),
        name: key,
        overwrite: true,
    }));
}

export function omitUpperPeerDependencyVersion(version: string): string {
    return version.split("||")[0].trim();
}
