// © 2026 SolarWinds Worldwide, LLC. All rights reserved.

import * as fs from "fs";

import { Page } from "@playwright/test";

import { ICameraSettings, ILens } from "./types";

export class EyesLens implements ILens {
    private snapshotsFolderName = "_snapshots";

    constructor(protected page: Page, protected settings: ICameraSettings) {}

    public async takeSnapshot(label: string): Promise<void> {
        await this.ensureDir();
        const filePath = this.buildFilePath(label);
        const buffer = await this.page.screenshot({ fullPage: false });
        await fs.promises.writeFile(filePath, buffer);
    }

    public async takeFullScreenSnapshot(label: string): Promise<void> {
        await this.ensureDir();
        const filePath = this.buildFilePath(label);
        const buffer = await this.page.screenshot({ fullPage: true });
        await fs.promises.writeFile(filePath, buffer);
    }

    public async cameraON(): Promise<void> {
        await this.page.addStyleTag({
            content:
                "input, textarea { caret-color: transparent;} * {cursor: none !important;}",
        });
    }

    public async cameraOFF(): Promise<void> {
        // no-op
    }

    public toolConfig(): any {
        return { name: "eyes", outputDir: this.snapshotsFolderName };
    }

    private buildFilePath(label: string): string {
        const safeTest = this.settings.currentTestName.replace(
            /[\\\/\s]/g,
            "_"
        );
        const safeLabel = label.replace(/[\\\/\s]/g, "_");
        return `${this.snapshotsFolderName}/${safeTest}_${safeLabel}.png`;
    }

    private async ensureDir(): Promise<void> {
        if (!fs.existsSync(this.snapshotsFolderName)) {
            await fs.promises.mkdir(this.snapshotsFolderName, {
                recursive: true,
            });
        }
    }
}
