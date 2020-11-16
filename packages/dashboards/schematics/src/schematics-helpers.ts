import { JsonAstArray, JsonAstObject, JsonParseMode, parseJsonAst } from "@angular-devkit/core";
import { Rule, SchematicContext, SchematicsException, Tree } from "@angular-devkit/schematics";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import { getWorkspace } from "@schematics/angular/utility/config";
import { NodeDependency, NodeDependencyType } from "@schematics/angular/utility/dependencies";
import { appendValueInAstArray, findPropertyInAstObject, insertPropertyInAstObjectInOrder } from "@schematics/angular/utility/json-utils";
import { getProject } from "@schematics/angular/utility/project";
import { getProjectTargets } from "@schematics/angular/utility/project-targets";
import { BrowserBuilderTarget } from "@schematics/angular/utility/workspace-models";
import ts from "typescript";

export function updateJsonFile(host: Tree, context: SchematicContext, filename: string, propertyChain: string[], itemToAdd: any) {
    const lastProperty = propertyChain[propertyChain.length - 1];
    try {
        const source = host.read(<string> filename)?.toString("utf-8");
        // @ts-ignore: Suppressing to avoid changing default behaviour
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

export function getBrowserProjectTargets(host: Tree, options: any): BrowserBuilderTarget {
    const workspace = getWorkspace(host);
    const clientProject = getProject(workspace, options.project);
    // @ts-ignore: Suppressing to avoid changing default behaviour
    return getProjectTargets(clientProject)["build"];
}

export function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
    const text = host.read(modulePath);
    if (text === null) {
        throw new SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString("utf-8");

    return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

export function assembleDependencies(dependencies: Record<string, string>): NodeDependency[] {
    return Object.keys(dependencies).map((key) => (
        {
            type: NodeDependencyType.Default,
            version: dependencies[key],
            name: key,
            overwrite: true,
        }
    ));
}

export function installPackageJsonDependencies(): Rule {
    return (host: Tree, context: SchematicContext) => {
        context.addTask(new NodePackageInstallTask());
        context.logger.info(` Installing packages...`);
        return host;
    };
}

export function addStylesToAngularJson(options: any, stylePaths: string[]) {
    return (host: Tree, context: SchematicContext) => {
        updateJsonFile(host,
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
    };
}
