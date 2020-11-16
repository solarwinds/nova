import { Component, forwardRef } from "@angular/core";

import { ValidationMessageComponent } from "../validation-message.component";

/**
 *
 * <h2>Required Modules</h2>
 *  <ul>
 *   <li>
 *      <code>NuiMessageModule</code>
 *   </li>
 *   <li>
 *      <code>NuiValidationMessageModule</code>
 *   </li>
 *  </ul>
 *
 */

@Component({
  selector: "nui-custom-validation-message",
  template: `
      <ng-container *ngIf="show">
          <ng-content></ng-content>
      </ng-container>
  `,
  providers: [{provide: ValidationMessageComponent, useExisting: forwardRef(() => CustomValidationMessageComponent)}],
})
export class CustomValidationMessageComponent extends ValidationMessageComponent {}
