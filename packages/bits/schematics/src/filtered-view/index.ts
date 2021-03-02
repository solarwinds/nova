import { strings } from "@angular-devkit/core";
import {
    apply,
    branchAndMerge,
    chain,
    filter,
    mergeWith,
    move,
    noop,
    Rule,
    schematic,
    SchematicsException,
    template,
    Tree,
    url
} from "@angular-devkit/schematics";
import { buildRelativePath, findModuleFromOptions } from "@schematics/angular/utility/find-module";
import { applyLintFix } from "@schematics/angular/utility/lint-fix";
import { getAppModulePath } from "@schematics/angular/utility/ng-ast-utils";
import { parseName } from "@schematics/angular/utility/parse-name";
import { validateHtmlSelector, validateName } from "@schematics/angular/utility/validation";
import { BrowserBuilderTarget } from "@schematics/angular/utility/workspace-models";

import { buildDefaultPath, getProject } from "../utility/project";
import { getProjectTargets } from "../utility/project-targets";
import { buildSelector, readIntoSourceFile, updateModuleChanges } from "../utility/schematics-helper";
import { getWorkspace } from "../utility/workspace";

import { Schema as ComponentOptions } from "./schema";

function getBrowserProjectTargets(host: Tree, options: any): BrowserBuilderTarget {
    const workspace = getWorkspace(host);
    const clientProject = getProject(workspace, options.project);
    return <any>getProjectTargets(clientProject)["build"];
}

function addDeclarationToNgModule(options: any): Rule {
    return (host: Tree) => {
        if (options.skipImport || !options.module) {
            return host;
        }
        const projectTargets = getBrowserProjectTargets(host, options);

        const mainPath = projectTargets.options.main;
        const appModulePath = getAppModulePath(host, mainPath);
        const moduleSource = readIntoSourceFile(host, appModulePath );
        const modulePath = options.module;
        const importedModulePath = `/${options.path}/`
            + (options.flat ? "" : strings.dasherize(options.name) + "/")
            + strings.dasherize(options.name)
            + ".module";

        const relativePath = buildRelativePath(modulePath, importedModulePath);

        updateModuleChanges(host, options, moduleSource,
            [
                {item: `${strings.classify(options.name)}Module`, path: relativePath},
                {item: "BrowserAnimationsModule", path: "@angular/platform-browser/animations"},
            ],
            [{item: "DatePipe", path: "@angular/common"}]
        );

        return host;
    };
}

export default function(options: ComponentOptions): Rule {
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
        const targetFolder = strings.dasherize(options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        options.selector = options.selector || buildSelector(options, project.prefix);

        addDeclarationToNgModule(options);

        validateName(options.name);
        validateHtmlSelector(options.selector);

        const filterGroupOptions: ComponentOptions = {...options};
        filterGroupOptions.name = "filter-group";
        filterGroupOptions.selector = `${options.prefix || project.prefix}-filter-group`;
        filterGroupOptions.path = `${options.path}/${targetFolder}`;
        filterGroupOptions.module = `${options.name}.module.ts`;
        filterGroupOptions.skipImport = true;

        const listOptions: any = {...options};
        listOptions.name = "filtered-view-list";
        listOptions.selector = `${options.selector}-list`;
        listOptions.path = `${options.path}/${targetFolder}`;
        listOptions.skipImport = true;
        listOptions.dataSourceName = options.name;

        // TODO: validate after creating proper schematic for table
        const tableOptions: any = {...options};
        tableOptions.name = "filtered-view-table";
        tableOptions.selector = `${options.selector}-table`;
        tableOptions.path = `${options.path}/${targetFolder}`;
        tableOptions.skipImport = true;
        tableOptions.dataSourceName = options.name;

        options.childSelector = options.presentationType === "table"
            ? tableOptions.selector
            : listOptions.selector;

        const templateSource = apply(url("./files"), [
            template({
                ...strings,
                "if-flat": (s: string) => options.flat ? "" : s,
                ...options,
            }),
            filter((path: string) => {
                if (options.dataSource === "none" && (
                    path.endsWith("data-source.service.ts")
                )) {
                    return false;
                }

                return options.dataSource !== "custom" ||
                    (
                        options.dataSource === "custom"
                        && !path.endsWith("data-source.service.ts")
                        && !path.endsWith("data.ts")
                        && !path.endsWith("types.ts")
                    );
            }),
            move(parsedPath.path),
        ]);

        return chain([
            mergeWith(templateSource),
            branchAndMerge(schematic("filter-group", filterGroupOptions)),
            options.presentationType === "table"
                ? branchAndMerge(schematic("table", tableOptions))
                : branchAndMerge(schematic("list", listOptions)),
            options.lintFix ? applyLintFix(options.path) : noop(),
        ]);
    };
}
