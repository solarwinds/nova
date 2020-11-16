import { JsonAstArray, JsonAstObject, JsonParseMode, parseJsonAst, strings } from "@angular-devkit/core";
import { SchematicContext, SchematicsException } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { addImportToModule } from "@angular/cdk/schematics";
import { addDeclarationToModule, addProviderToModule, isImported } from "@schematics/angular/utility/ast-utils";
import { InsertChange } from "@schematics/angular/utility/change";
import {
    appendValueInAstArray,
    findPropertyInAstObject,
    insertPropertyInAstObjectInOrder
} from "@schematics/angular/utility/json-utils";
import * as ts from "typescript";

export function updateJsonFile(host: Tree, context: SchematicContext, filename: string, propertyChain: string[], itemToAdd: any) {
    const lastProperty = propertyChain[propertyChain.length - 1];
    try {
        const source = host.read(<string> filename)?.toString("utf-8") ?? "";
        const sourceAstObj = <JsonAstObject>parseJsonAst(source, JsonParseMode.Strict);

        let targetObj: JsonAstObject, parentObj: JsonAstObject | undefined;

        targetObj = sourceAstObj;

        for (let i = 0; i < propertyChain.length; i++) {
            parentObj = targetObj;
            targetObj = <JsonAstObject>findPropertyInAstObject(<JsonAstObject>parentObj, propertyChain[i]);
        }

        const recorder = host.beginUpdate(filename);

        const targetArray = <JsonAstArray><any>targetObj;

        if (targetArray && Array.isArray(itemToAdd)) {
            //  we don't want a double not equal here
            // tslint:disable-next-line:triple-equals
            if (targetArray.elements.every(element => element.value != itemToAdd)) {
                const lastStyle = targetArray.elements[targetArray.elements.length - 1];
                const lastStyleIndent = lastStyle ? lastStyle.start.character : 0;
                appendValueInAstArray(recorder, targetArray, itemToAdd[0], lastStyleIndent);
            } else {
                context.logger.info(`️ ${filename} already contains ${lastProperty}`);
            }
        } else {
            // we don't want a double not equal here
            // tslint:disable-next-line:triple-equals
            if (parentObj?.properties.every(property => property.key.value != lastProperty)) {
                const lastItemIndent = parentObj.properties[0] ? parentObj.properties[0].start.character : 0;
                insertPropertyInAstObjectInOrder(recorder, parentObj, lastProperty, itemToAdd, lastItemIndent);
            } else {
                context.logger.info(`️ ${filename} already contains ${lastProperty}`);
            }
        }
        host.commitUpdate(recorder);

    } catch (ex) {
        context.logger.error(`🚫 Failed to update ${filename} with ${lastProperty}: ${ex.toString()}`);
    }
    context.logger.info(`✅️ Updated ${filename} with ${lastProperty}`);

    return host;
}

export function buildSelector(options: any, projectPrefix: string) {
    let selector = strings.dasherize(options.name);

    if (options.prefix) {
        selector = `${options.prefix}-${selector}`;
    } else if (options.prefix === undefined && projectPrefix) {
        selector = `${projectPrefix}-${selector}`;
    }

    return selector;
}

export function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
    const text = host.read(modulePath);

    if (text === null) {
        throw new SchematicsException(`File ${modulePath} does not exist.`);
    }

    const sourceText = text.toString("utf-8");

    return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
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
) {
    const modulePath = options.module;

    const declarationRecorder = host.beginUpdate(modulePath);

    declarations.forEach(item => {
        const changeList = addDeclarationToModule(moduleSource, modulePath, item.item, item.path);
        changeList.forEach(change => {
            if (change instanceof InsertChange) {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        });
    });

    providers.forEach(item => {
        const changeList = addProviderToModule(moduleSource, modulePath, item.item, item.path);

        changeList.forEach(change => {
            if (change instanceof InsertChange) {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        });
    });

    modules.forEach(item => {
        if (!isImported(moduleSource, item.item, item.path)) {
            const moduleChanges = addImportToModule(moduleSource, modulePath, item.item, module.path);
            moduleChanges.forEach(change => {
                if (change instanceof InsertChange) {
                    declarationRecorder.insertLeft(change.pos, change.toAdd);
                }
            });
        }
    });

    host.commitUpdate(declarationRecorder);
}
