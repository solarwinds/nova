import { JsonAstArray, JsonAstObject, JsonParseMode, parseJson, parseJsonAst, strings } from "@angular-devkit/core";
import { SchematicContext, SchematicsException } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { addImportToModule } from "@angular/cdk/schematics";
import { addDeclarationToModule, addProviderToModule, isImported } from "@schematics/angular/utility/ast-utils";
import { InsertChange } from "@schematics/angular/utility/change";
import { BrowserBuilderTarget, ProjectType, WorkspaceProject, WorkspaceSchema, WorkspaceTargets } from "@schematics/angular/utility/workspace-models";
import ts from "typescript";

import { appendValueInAstArray, findPropertyInAstObject, insertPropertyInAstObjectInOrder } from "./json-utils";

export function updateJsonFile(host: Tree, context: SchematicContext, filename: string, propertyChain: string[], itemToAdd: any) {
    const lastProperty = propertyChain[propertyChain.length - 1];
    try {
        const source = host.read(<string>filename)?.toString("utf-8") ?? "";
        const sourceAstObj = <JsonAstObject>parseJsonAst(source, JsonParseMode.CommentsAllowed);

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

export function getWorkspacePath(host: Tree): string {
    const possibleFiles = ["/angular.json", "/.angular.json"];
    const path = possibleFiles.filter(p => host.exists(p))[0];
    return path;
}

export function getWorkspace(host: Tree): WorkspaceSchema {
    const path = getWorkspacePath(host);
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new SchematicsException(`Could not find (${path})`);
    }
    const content = configBuffer.toString();

    return parseJson(content, JsonParseMode.Loose) as {} as WorkspaceSchema;
}

export function buildDefaultPath(project: WorkspaceProject): string {
    const root = project.sourceRoot
        ? `/${project.sourceRoot}/`
        : `/${project.root}/src/`;

    const projectDirName = project.projectType === ProjectType.Application ? "app" : "lib";

    return `${root}${projectDirName}`;
}

export function getProject<TProjectType extends ProjectType = ProjectType.Application>(
    workspaceOrHost: WorkspaceSchema | Tree,
    projectName: string
): WorkspaceProject<TProjectType> {
    const workspace = isWorkspaceSchema(workspaceOrHost)
        ? workspaceOrHost
        : getWorkspace(workspaceOrHost);

    return workspace.projects[projectName] as WorkspaceProject<TProjectType>;
}

export function isWorkspaceSchema(workspace: any): workspace is WorkspaceSchema {
    return !!(workspace && (workspace as WorkspaceSchema).projects);
}

export function isWorkspaceProject(project: any): project is WorkspaceProject {
    return !!(project && (project as WorkspaceProject).projectType);
}

export function getProjectTargets(project: WorkspaceProject): WorkspaceTargets;
export function getProjectTargets(
    workspaceOrHost: WorkspaceSchema | Tree,
    projectName: string
): WorkspaceTargets;
export function getProjectTargets(
    projectOrHost: WorkspaceProject | Tree | WorkspaceSchema,
    projectName = ""
): WorkspaceTargets {
    const project = isWorkspaceProject(projectOrHost)
        ? projectOrHost
        : getProject(projectOrHost, projectName);

    const projectTargets = project.targets || project.architect;
    if (!projectTargets) {
        throw new Error("Project target not found.");
    }

    return projectTargets;
}

export function getBrowserProjectTargets(host: Tree, options: any): BrowserBuilderTarget {
    const workspace = getWorkspace(host);
    const clientProject = getProject(workspace, options.project);
    // @ts-ignore: Avoiding strict mode errors, preserving old behavior
    return getProjectTargets(clientProject)["build"];
}
