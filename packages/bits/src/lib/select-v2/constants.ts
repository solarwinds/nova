import { InjectionToken } from "@angular/core";

import { IOptionedComponent } from "./types";

// Will be renamed in scope of the NUI-5797
export const NUI_SELECT_V2_OPTION_PARENT_COMPONENT =
    new InjectionToken<IOptionedComponent>(
        "NUI_SELECT_V2_OPTION_PARENT_COMPONENT"
    );
export const ANNOUNCER_OPEN_MESSAGE_SUFFIX = "options available";
export const ANNOUNCER_CLOSE_MESSAGE = "Dropdown closed";
