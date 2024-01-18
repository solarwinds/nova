import { ANGULAR_JSON } from "../live-example-files/angular.json";
import { APP_COMPONENT } from "../live-example-files/app.component";
import { APP_MODULE } from "../live-example-files/app.module";
import { INDEX } from "../live-example-files/index.html";
import { MAIN } from "../live-example-files/main";
import { PACKAGE_JSON } from "../live-example-files/package.json";
import { POLYFILLS } from "../live-example-files/polyfills";
import { TSCONFIG_JSON } from "../live-example-files/tsconfig.json";
import { FileMetadata } from "../services/sources.service";

export const createAngularApp = (
    filenamePrefix: string,
    context: string,
    sources: FileMetadata[],
    latestNovaVersion: string
): { files: Record<string, object> } => {
    let files: Record<string, object> = {
        "src/index.html": {
            content: getIndex(filenamePrefix),
        },
        "src/main.ts": {
            content: getMainFile(),
        },
        "src/polyfills.ts": {
            content: getPolyfills(),
        },
        "src/styles.less": {
            content: getStyles(),
        },
        "angular.json": {
            content: getAngular(),
        },
        "package.json": {
            content: getPackage(
                sources.find(
                    (source: FileMetadata) => source.fileName === "package.json"
                )?.fileContent ?? "",
                latestNovaVersion
            ),
        },
        "src/app/app.module.ts": {
            content: getAppModule(
                sources,
                filenamePrefix,
                context,
                sources.find(
                    (source: FileMetadata) => source.fileName === "package.json"
                )?.fileContent ?? ""
            ),
        },
        "src/app/app.component.ts": {
            content: getAppComponent(),
        },
        "tsconfig.json": {
            content: getTSConfig(),
        },
    };

    sources
        .filter((source: FileMetadata) => source.fileName !== `package.json`)
        .forEach((source: FileMetadata) => {
            files = Object.assign(files, {
                [`src/app/${source.filePath}`]: { content: source.fileContent },
            });
        });

    return { files: files };
};

export const getMainFile = (): string => MAIN;
export const getIndex = (componentSelector: string): string =>
    INDEX.replace("${componentSelector}", componentSelector);

export const getAppModule = (
    sources: FileMetadata[],
    filenamePrefix: string,
    context: string,
    packageJson: string
): string => {
    const mainComponentName = getMainComponentName(sources, filenamePrefix);
    const componentNames = sources
        .filter((source: FileMetadata) => source.fileType === "ts")
        .map((source: FileMetadata) => getComponentName(source))
        .join(",");
    const imports = sources
        .filter((source: FileMetadata) => source.fileType === "ts")
        .filter((source: FileMetadata) => source.fileName !== `routes.ts`)
        .map(
            (source) =>
                `import { ${getComponentName(
                    source
                )} } from "./${source.filePath.slice(
                    0,
                    -source.fileType.length - 1
                )}"`
        )
        .join("\n");
    const libPackage = JSON.parse(packageJson).name;
    const chartsImport = libPackage === "@nova-ui/charts";
    const dashboardsImport = libPackage === "@nova-ui/dashboards";
    const customRoutes = !!sources.find(
        (source: FileMetadata) => source.fileName === "routes.ts"
    );

    return APP_MODULE(
        filenamePrefix,
        context,
        imports,
        mainComponentName,
        componentNames,
        customRoutes,
        chartsImport,
        dashboardsImport
    );
};

export const getStyles = (): string => ``;

export const getAngular = (): string => ANGULAR_JSON;

export const getTSConfig = (): string => TSCONFIG_JSON;

export const getPolyfills = (): string => POLYFILLS;

export const getPackage = (
    packageJson: string,
    latestNovaVersion: string
): string => {
    const libPackage = JSON.parse(packageJson);
    const newPackage = PACKAGE_JSON;

    const getVersion = (name: string): string =>
        libPackage.devDependencies[name];

    const dependencies = [
        "@angular/animations",
        "@angular/cdk",
        "@angular/common",
        "@angular/compiler",
        "@angular/core",
        "@angular/forms",
        "@angular/localize",
        "@angular/platform-browser",
        "@angular/platform-browser-dynamic",
        "@angular/router",
        "d3",
        "d3-selection-multi",
        "d3-shape",
        "angular-gridster2",
        "core-js",
        "highlight.js",
        "lodash",
        "moment",
        "rxjs",
        "tslib",
        "zone.js",
    ];

    const devDependencies = [
        "@angular-devkit/build-angular",
        "@angular/cli",
        "@angular/compiler-cli",
        "@types/node",
        "typescript",
    ];

    dependencies.forEach((dependency: string) =>
        getVersion(dependency)
            ? ((newPackage.dependencies as Record<string, string>)[dependency] =
                  getVersion(dependency))
            : null
    );

    devDependencies.forEach(
        (devDependency: string) =>
            ((newPackage.dependencies as Record<string, string>)[
                devDependency
            ] = getVersion(devDependency))
    );

    // last released nova
    newPackage.dependencies["@nova-ui/bits"] = latestNovaVersion;
    newPackage.dependencies["@nova-ui/charts"] = latestNovaVersion;
    newPackage.dependencies["@nova-ui/dashboards"] = latestNovaVersion;

    return JSON.stringify(newPackage, null, " ");
};

export const getMainComponentName = (
    sources: FileMetadata[],
    filenamePrefix: string
): string => {
    const mainComponent = sources
        .filter((source: FileMetadata) => source.fileType === "ts")
        .find((source: FileMetadata) =>
            source.fileName.includes(filenamePrefix)
        );
    return getComponentName(mainComponent as any);
};

export const getComponentName = (source: FileMetadata): string => {
    const matches: RegExpMatchArray | null | undefined =
        source?.fileContent.match(/export class (\w+Component)/);
    return (matches || [])[1]; // capture exported component name
};

export const getAppComponent = (): string => APP_COMPONENT;
