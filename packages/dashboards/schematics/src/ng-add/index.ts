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
    addImportToModule,
    isImported,
} from "@schematics/angular/utility/ast-utils";
import { InsertChange } from "@schematics/angular/utility/change";
import {
    addPackageJsonDependency,
    NodeDependency,
} from "@schematics/angular/utility/dependencies";
import { getAppModulePath } from "@schematics/angular/utility/ng-ast-utils";

import {
    addStylesToAngularJson,
    assembleDependencies,
    getBrowserProjectTargets,
    installPackageJsonDependencies,
    readIntoSourceFile,
} from "@nova-ui/bits/sdk/schematics";

const stylePaths = ["./node_modules/@nova-ui/charts/bundles/css/styles.css"];

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
        options && options.skipModuleUpdate
            ? noop()
            : updateModuleFile(options),
        options && options.skipCss
            ? noop()
            : addStylesToAngularJson(options, stylePaths),
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

function updateModuleFile(options: any): Rule {
    return (host: Tree, context: SchematicContext) => {
        try {
            const projectTargets = getBrowserProjectTargets(host, options);

            // @ts-ignore ng 17 defaults to application builder which has browser
            const mainPath = projectTargets.options["browser"];
            const modulePath = getAppModulePath(host, mainPath);
            const moduleSource = readIntoSourceFile(host, modulePath);

            const declarationRecorder = host.beginUpdate(modulePath);

            const modules = [
                {
                    item: `BrowserAnimationsModule`,
                    path: `@angular/platform-browser/animations`,
                },
                { item: `NuiDashboardsModule`, path: `@nova-ui/dashboards` },
            ];

            modules.forEach((module) => {
                if (!isImported(moduleSource, module.item, module.path)) {
                    const moduleChanges = addImportToModule(
                        moduleSource,
                        modulePath,
                        module.item,
                        module.path
                    );
                    moduleChanges.forEach((change) => {
                        if (change instanceof InsertChange) {
                            declarationRecorder.insertLeft(
                                change.pos,
                                change.toAdd
                            );
                        }
                    });
                    context.logger.info(`   recorded ${module.item} add`);
                } else {
                    context.logger.info(`   ${module.item} already imported`);
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
