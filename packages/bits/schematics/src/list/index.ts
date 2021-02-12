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
    SchematicsException,
    template,
    Tree,
    url,
} from "@angular-devkit/schematics";
import { addExportToModule } from "@schematics/angular/utility/ast-utils";
import { InsertChange } from "@schematics/angular/utility/change";
import { buildRelativePath, findModuleFromOptions } from "@schematics/angular/utility/find-module";
import { applyLintFix } from "@schematics/angular/utility/lint-fix";
import { parseName } from "@schematics/angular/utility/parse-name";
import { validateHtmlSelector, validateName } from "@schematics/angular/utility/validation";

import {buildDefaultPath, buildSelector, getProject, readIntoSourceFile, updateModuleChanges} from "../schematics-helper";

import { Schema as ComponentOptions } from "./schema";

function addDeclarationToNgModule(options: ComponentOptions): Rule {
    return (host: Tree) => {
        if (options.skipImport || !options.module) {
            return host;
        }

        const modulePath = options.module;
        let moduleSource = readIntoSourceFile(host, modulePath);

        const componentPath = `/${options.path}/`
            + (options.flat ? "" : strings.dasherize(options.name) + "/")
            + strings.dasherize(options.name)
            + ".component";
        const relativePath = buildRelativePath(modulePath, componentPath);
        const componentName = strings.classify(`${options.name}Component`);

        // default modules to be imported
        const modules = [
            {item: "NuiSorterModule", path: "@nova-ui/bits"},
            {item: "NuiRepeatModule", path: "@nova-ui/bits"},
        ];

        // additional module(s) used only for search functionality
        if (options.enableSearch) {
            modules.push({item: "NuiSearchModule", path: "@nova-ui/bits"});
        }

        // additional module(s) used only for pagination
        if (options.pagingMode === "pagination") {
            modules.push({item: "NuiPaginatorModule", path: "@nova-ui/bits"});
        }

        // additional module(s) used only for virtual scroll
        if (options.dataSource === "serverSide") {
            if (options.dataSource === "serverSide") {
                modules.push({item: "HttpClientModule", path: "@angular/common/http"});
            }
            modules.push(
                {item: "NuiBusyModule", path: "@nova-ui/bits"},
                {item: "NuiSpinnerModule", path: "@nova-ui/bits"}
            );
        }

        updateModuleChanges(host, options, moduleSource, modules, [],
            [{item: componentName, path: relativePath }]
        );

        if (options.export) {
            // Need to refresh the AST because we overwrote the file in the host.
            moduleSource = readIntoSourceFile(host, modulePath);

            const exportRecorder = host.beginUpdate(modulePath);
            const exportChanges = addExportToModule(moduleSource, modulePath,
                strings.classify(`${options.name}Component`),
                relativePath);

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
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        options.selector = options.selector || buildSelector(options, project.prefix);
        options.dataSourceName = options.dataSourceName || options.name;

        validateName(options.name);
        validateHtmlSelector(options.selector);

        const templateSource = apply(url("./files"), [
            template({
                ...strings,
                "if-flat": (s: string) => options.flat ? "" : s,
                ...options,
            }),
            filter((path: string) => {
                if (options.dataSource === "custom" && (
                    path.endsWith("data-source.service.ts") || path.endsWith("types.ts")
                )) {
                    return false;
                }

                if (options.dataSource === "none" && (
                    path.endsWith("data-source.service.ts")
                )) {
                    return false;
                }

                return (
                        options.dataSourceName === options.name
                    )
                    ||
                    (
                        options.dataSourceName !== options.name
                        && !path.endsWith("data-source.service.ts")
                        && !path.endsWith("types.ts")
                        && !path.endsWith("data.ts")
                    );
            }),
            move(`${parsedPath.path}/${parsedPath.name}`),
        ]);

        return chain([
            branchAndMerge(chain([
                addDeclarationToNgModule(options),
                mergeWith(templateSource),
            ])),
            options.lintFix ? applyLintFix(options.path) : noop(),
        ]);
    };
}
