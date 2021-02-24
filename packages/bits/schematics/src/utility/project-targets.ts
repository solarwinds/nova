/*****************************************************************
 *
 * This file consists of schematics utility functions recovered from deletions in the angular-cli repo
 * https://github.com/angular/angular-cli/commit/51549977286904b65c800f44792e19ed671c3b8d
 *
 *****************************************************************/

import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { WorkspaceProject, WorkspaceSchema, WorkspaceTargets } from "@schematics/angular/utility/workspace-models";

import { getProject, isWorkspaceProject } from "./project";

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
