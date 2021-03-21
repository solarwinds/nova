import { ProtractorBrowser } from "protractor";
import { ICameraSettings, ILens } from "./types";
import { getCurrentBranchName } from "../helpers";
export class EyesLens implements ILens {
    private eyes: any;

    constructor(private browser: ProtractorBrowser, private settings: ICameraSettings) {
    }

    public async takeSnapshot(label: string): Promise<void> {
        await this.eyes.setForceFullPageScreenshot(true);
        await this.snapshotEachWidth(label);
    }

    public async takeFullScreenSnapshot(label: string): Promise<void> {
        await this.eyes.setForceFullPageScreenshot(false);
        await this.snapshotEachWidth(label);
    }

    public async cameraON() {
        console.log(
`
*******************************
    EYES Camera turned ON!
*******************************
\n`
        );
        this.eyes = await this.configure();

        await this.eyes.open(this.browser, this.settings.currentSuiteName, this.settings.currentTestName);
    }

    public async cameraOFF() {
        console.log(
`
*******************************
    EYES Camera turned OFF!
*******************************
\n`
        );

        await this.eyes.close();
    }

    private async configure() {
        const { Eyes } = require("@applitools/eyes-protractor");

        if (!this.eyes) {
            this.eyes = new Eyes;
            this.eyes.setApiKey(<string>process.env.EYES_API_KEY);

            let branchName = <string>process.env.CIRCLE_BRANCH || getCurrentBranchName() || "Unknown";
            const userName: string = <string>process.env.CIRCLE_USERNAME ? ` - [${process.env.CIRCLE_USERNAME}]` : "";
            const batchName = (<string>process.env.CIRCLE_PROJECT_REPONAME)?.toUpperCase()
                                + " - "
                                + <string>process.env.CIRCLE_JOB
                                + " - "
                                + branchName
                                + userName;
            const batchID = <string>process.env.CIRCLE_JOB + "_" + <string>process.env.CIRCLE_SHA1;

            branchName = branchName.substring(branchName.lastIndexOf("/") + 1);
            batchID ? this.eyes.setBatch(batchName, batchID)
                    : this.eyes.setBatch(batchName);

            this.eyes.setBranchName(branchName);
            if (branchName !== "main") {
                this.eyes.setParentBranchName("main");
            }
            this.eyes.setForceFullPageScreenshot(true);
            this.eyes.setIgnoreCaret(true);
        }

        return this.eyes;
    }

    private async snapshotEachWidth(label: string): Promise<void> {
        for (let width of this.settings.responsive) {
            await this.browser.manage().window().setSize(width, 1080);
            await this.eyes.checkWindow(label);
        }
    }
}
