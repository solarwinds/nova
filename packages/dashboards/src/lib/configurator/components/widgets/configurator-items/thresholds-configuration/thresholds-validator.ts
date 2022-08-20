import { AbstractControl, ValidatorFn } from "@angular/forms";
import { removeErrors } from "@nova-ui/bits";
import _isNil from "lodash/isNil";

export const thresholdsValidator: ValidatorFn = (form: AbstractControl) => {
    const critical = form.get("criticalThresholdValue");
    const warning = form.get("warningThresholdValue");
    const reverse = form.get("reversedThresholds");
    const show = form.get("showThresholds");

    if (!critical) {
        throw new Error("criticalThresholdValue formControl is not defined");
    }
    removeErrors(critical, "min", "max");

    if (!warning) {
        throw new Error("warningThresholdValue formControl is not defined");
    }
    removeErrors(warning, "min", "max");

    if (show?.value) {
        if (_isNil(warning.value)) {
            return null;
        }
        if (reverse?.value) {
            if (critical.value >= warning.value) {
                warning.setErrors({ min: true });
                critical.setErrors({ max: true });
                return { thresholds: true };
            }
        } else {
            if (critical.value <= warning.value) {
                warning.setErrors({ max: true });
                critical.setErrors({ min: true });
                return { thresholds: true };
            }
        }
    }

    return null;
};
