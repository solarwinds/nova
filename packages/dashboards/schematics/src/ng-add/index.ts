import { chain, noop, Rule, SchematicContext, SchematicsException, Tree } from "@angular-devkit/schematics";
import { addImportToModule, isImported } from "@schematics/angular/utility/ast-utils";
import { InsertChange } from "@schematics/angular/utility/change";
import { addPackageJsonDependency, NodeDependency } from "@schematics/angular/utility/dependencies";
import { getAppModulePath } from "@schematics/angular/utility/ng-ast-utils";

import { addStylesToAngularJson, assembleDependencies, getBrowserProjectTargets, installPackageJsonDependencies, readIntoSourceFile } from "../schematics-helpers";

const stylePaths = ["./node_modules/@nova-ui/charts/bundles/css/styles.css"];

export default function (options: any): Rule {
    if (!options.project) {
        throw new SchematicsException("Option (project) is required.");
    }

    return chain([
        options && options.skipPackageJson ? noop() : addPackageJsonDependencies(),
        options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
        options && options.skipModuleUpdate ? noop() : updateModuleFile(options),
        options && options.skipCss ? noop() : addStylesToAngularJson(options, stylePaths),
    ]);
}

function addPackageJsonDependencies(): Rule {
    return (host: Tree, context: SchematicContext) => {
        const { peerDependencies } = require("../../../package.json");

        const dependencies: NodeDependency[] = assembleDependencies(peerDependencies);
        dependencies.forEach(dependency => {
            addPackageJsonDependency(host, dependency);
            context.logger.info(`✅️ Added "${dependency.name}" into ${dependency.type}`);
        });

        return host;
    };
}

function updateModuleFile(options: any): Rule {
    return (host: Tree, context: SchematicContext) => {
        try {
            const projectTargets = getBrowserProjectTargets(host, options);

            const mainPath = projectTargets.options.main;
            const modulePath = getAppModulePath(host, mainPath);
            const moduleSource = readIntoSourceFile(host, modulePath);

            const declarationRecorder = host.beginUpdate(modulePath);

            const modules = [
                { item: `BrowserAnimationsModule`, path: `@angular/platform-browser/animations` },
                { item: `NuiDashboardsModule`, path: `@nova-ui/dashboards` },
            ];

            modules.forEach(module => {
                if (!isImported(moduleSource, module.item, module.path)) {
                    const moduleChanges = addImportToModule(moduleSource, modulePath, module.item, module.path);
                    moduleChanges.forEach(change => {
                        if (change instanceof InsertChange) {
                            declarationRecorder.insertLeft(change.pos, change.toAdd);
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
