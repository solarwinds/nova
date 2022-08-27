import { InjectionToken } from "@angular/core";

import { IImagesPresetItem } from "../lib/image/public-api";

export const imagesPresetToken = new InjectionToken<Array<IImagesPresetItem>>(
    "IMAGES_PRESET"
);

// This ts file used to supply the image data for the whole nui library.  However, there is an angular bug that prevents
// loading certain files in this manner: https://github.com/angular/angular/issues/20931
// To get around this, we changed all references to the images to be direct.  This can be reverted after the angular
// bug has been addressed.
