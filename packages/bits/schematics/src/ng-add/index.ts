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

import {
    chain,
    noop,
    Rule,
    SchematicContext,
    SchematicsException,
    Tree,
} from "@angular-devkit/schematics";
import {
    addProviderToModule,
    insertImport,
} from "@schematics/angular/utility/ast-utils";
import { InsertChange } from "@schematics/angular/utility/change";
import {
    addPackageJsonDependency,
    NodeDependency,
} from "@schematics/angular/utility/dependencies";
import { getAppModulePath } from "@schematics/angular/utility/ng-ast-utils";

import {
    assembleDependencies,
    getBrowserProjectTargets,
    installPackageJsonDependencies,
    readIntoSourceFile,
    updateJsonFile,
} from "../utility/schematics-helper";

export default function (options: any): Rule {
    if (!options.project) {
        throw new SchematicsException("Option (project) is required.");
    }

    return chain([
        options && options.skipPackageJson
            ? noop()
            : addPackageJsonDependencies(),
        options && options.skipPackageJson
            ? noop()
            : installPackageJsonDependencies(),
        options && options.skipProviders ? noop() : addProviders(options),
        options && options.skipCss ? noop() : addRootCssClass(options),
        options && options.skipCss ? noop() : addCssToAngularJson(options),
        addPreprocessorOptionsToAngularJson(options),
        options && options.skipTsConfig
            ? noop()
            : addSyntheticImportsToTsConfig(options),
    ]);
}
function addPackageJsonDependencies(): Rule {
    return (host: Tree, context: SchematicContext) => {
        const { peerDependencies } = require("../../../package.json");

        const dependencies: NodeDependency[] =
            assembleDependencies(peerDependencies);
        dependencies.forEach((dependency) => {
            addPackageJsonDependency(host, dependency);
            context.logger.info(
                `✅️ Added "${dependency.name}" into ${dependency.type}`
            );
        });

        return host;
    };
}

function addProviders(options: any): Rule {
    return (host: Tree, context: SchematicContext) => {
        try {
            const projectTargets = getBrowserProjectTargets(host, options);

            const mainPath = projectTargets.options.main;
            const modulePath = getAppModulePath(host, mainPath);
            const moduleSource = readIntoSourceFile(host, modulePath);

            const providers: string[] = [
                `{provide: TRANSLATIONS_FORMAT, useValue: "xlf"},`,
                `{provide: TRANSLATIONS, useValue: ""},`,
            ];

            const declarationRecorder = host.beginUpdate(modulePath);
            const spaceRegex = /\r?\n|\r| /g;
            providers.forEach((provider) => {
                const moduleSourceMinified = moduleSource.text.replace(
                    spaceRegex,
                    ""
                );
                const providerIndex = provider.indexOf("provide:");
                const commaIndex = provider.indexOf(",");
                const providerString = provider
                    .replace(spaceRegex, "")
                    .substring(providerIndex, commaIndex);

                // since we are doing a "usevalue" provide, we can't use the nice isImported
                if (!moduleSourceMinified.includes(providerString)) {
                    const providerChanges = addProviderToModule(
                        moduleSource,
                        modulePath,
                        provider,
                        // @ts-ignore: Avoiding strict mode errors, preserving old behaviour
                        undefined
                    );

                    providerChanges.forEach((change) => {
                        if (change instanceof InsertChange) {
                            declarationRecorder.insertLeft(
                                change.pos,
                                change.toAdd
                            );
                        }
                    });
                    context.logger.info(`   recorded provider add`);
                } else {
                    context.logger.info(
                        `   translation providers already present`
                    );
                }
            });

            const imports = [
                { item: `TRANSLATIONS`, path: `@angular/core` },
                { item: `MissingTranslationStrategy`, path: `@angular/core` },
                { item: `TRANSLATIONS_FORMAT`, path: `@angular/core` },
            ];

            imports.forEach((importable) => {
                if (!moduleSource.text.includes(importable.item)) {
                    // since we are doing a "useValue" provide, we can't use the nice isImported
                    const importChange = insertImport(
                        moduleSource,
                        modulePath,
                        importable.item,
                        importable.path
                    );
                    if (importChange instanceof InsertChange) {
                        declarationRecorder.insertLeft(
                            importChange.pos,
                            importChange.toAdd
                        );
                    }
                    context.logger.info(`   recorded translation imports`);
                } else {
                    context.logger.info(
                        `   translation imports already present`
                    );
                }
            });

            host.commitUpdate(declarationRecorder);

            context.logger.info(`✅️ Updated module file`);
        } catch (ex) {
            context.logger.error(`🚫 Failed updating module: ${ex.toString()}`);
        }
        return host;
    };
}

function addRootCssClass(options: any) {
    return (host: Tree, context: SchematicContext) => {
        try {
            const projectTargets = getBrowserProjectTargets(host, options);

            const filePath = projectTargets.options.index;
            const rootHtmlFile = host.read(filePath ?? "");

            if (rootHtmlFile) {
                let rootHtml = rootHtmlFile.toString("utf-8");

                if (!rootHtml.match(/<html.*(class=".*nui.*").*>/)) {
                    // TODO need a proper html parser here
                    rootHtml = rootHtml.replace("<html", '<html class="nui"');

                    host.overwrite(filePath ?? "", rootHtml);
                } else {
                    context.logger.info(`️ root html already contains class`);
                }
            }
        } catch (ex) {
            context.logger.error(
                `🚫 Failed to add root Css class to body: ${ex.toString()}`
            );
        }
        context.logger.info(`✅️ Added root Css class to body`);
        return host;
    };
}

function addSyntheticImportsToTsConfig(options: any) {
    return (host: Tree, context: SchematicContext) => {
        const projectTargets = getBrowserProjectTargets(host, options);
        const tsConfigPath = projectTargets.options.tsConfig;

        updateJsonFile(
            host,
            context,
            tsConfigPath,
            ["compilerOptions", "allowSyntheticDefaultImports"],
            true,
            false
        );
    };
}

function addCssToAngularJson(options: any) {
    return (host: Tree, context: SchematicContext) => {
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
            ["./node_modules/@nova-ui/bits/bundles/css/styles.css"]
        );
    };
}
function addPreprocessorOptionsToAngularJson(options: any) {
    return (host: Tree, context: SchematicContext) => {
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
                "stylePreprocessorOptions",
            ],
            {
                includePaths: ["node_modules"],
            }
        );
    };
}
