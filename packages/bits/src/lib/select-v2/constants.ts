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

import { InjectionToken } from "@angular/core";

import { IOptionedComponent } from "./types";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";

// Will be renamed in scope of the NUI-5797
export const NUI_SELECT_V2_OPTION_PARENT_COMPONENT =
    new InjectionToken<IOptionedComponent>(
        "NUI_SELECT_V2_OPTION_PARENT_COMPONENT"
    );
export const ANNOUNCER_OPEN_MESSAGE_SUFFIX = "options available";
export const ANNOUNCER_CLOSE_MESSAGE = "Dropdown closed";

/** Whether the key is an arrow key. */
export function isArrowKey(code: string): boolean {
    return (
        code === KEYBOARD_CODE.ARROW_LEFT ||
        code === KEYBOARD_CODE.ARROW_RIGHT ||
        code === KEYBOARD_CODE.ARROW_UP ||
        code === KEYBOARD_CODE.ARROW_DOWN
    );
}

/** Whether the key should return focus to the list; excludes the action's own entry key. */
export function isReturnToListKey(code: string, entryKey?: string): boolean {
    if (code === entryKey) {
        return false;
    }
    return isArrowKey(code) || code === KEYBOARD_CODE.ESCAPE;
}
