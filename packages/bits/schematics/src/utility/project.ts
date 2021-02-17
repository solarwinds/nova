/*****************************************************************
 *
 * This file consists of schematics utility functions recovered from deletions in the angular-cli repo
 * https://github.com/angular/angular-cli/commit/51549977286904b65c800f44792e19ed671c3b8d
 *
 *****************************************************************/

import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { WorkspaceProject, ProjectType, WorkspaceSchema } from "@schematics/angular/utility/workspace-models";
import { getWorkspace } from "./workspace";

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
