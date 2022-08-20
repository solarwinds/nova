import { by, element } from "protractor";

import { Atom } from "../../atom";

export class OverlayAtom extends Atom {
    public static CSS_CLASS = "nui-overlay";
    public static CDK_CONTAINER = "cdk-overlay-container";
    public static CDK_CONTAINER_BOX =
        "cdk-overlay-connected-position-bounding-box";
    public static CDK_CONTAINER_PANE = "cdk-overlay-pane";

    public static cdkContainer = element(
        by.className(OverlayAtom.CDK_CONTAINER)
    );
    public static cdkContainerBox = element(
        by.className(OverlayAtom.CDK_CONTAINER_BOX)
    );
    public static cdkContainerPane = element(
        by.className(OverlayAtom.CDK_CONTAINER_PANE)
    );

    public async isOpened(): Promise<boolean> {
        return OverlayAtom.cdkContainerPane.isPresent();
    }
}
