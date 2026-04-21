# Bits E2E Coverage Report

Generated from repository contents on 2026-04-20.

## Method notes

- Public API scope was taken from `packages/bits/src/public_api.ts` and `packages/bits/src/lib/public-api.ts`.
- E2E source was reviewed under `packages/bits/e2e/components`.
- `packages/bits/test-results/e2e-coverage-ai/inventory.json` was not present.
- No usable E2E line/branch instrumentation artifacts were found, so all percentages below are **estimated** from source-to-test behavior mapping.
- Skipped or commented suites were treated as weak or no effective coverage.

## Naming mismatches

- `date-picker` ↔ `datepicker`
- `date-time-picker` ↔ `datetimepicker`
- `time-picker` ↔ `timepicker`
- `dragdrop` / `dnd` ↔ `drag-and-drop`
- `radio` ↔ `radio-group`
- `tabgroup` ↔ `tab-heading-group`
- `public-api.ts` ↔ `public_api.ts`

## Executive summary

| Component                     |        E2E specs | A11y specs | Visual specs | Line coverage % | Branch coverage % | Confidence | Status               | Main gap                                 |
| ----------------------------- | ---------------: | ---------: | -----------: | --------------: | ----------------: | ---------- | -------------------- | ---------------------------------------- |
| Breadcrumb                    |                1 |          1 |            1 |              55 |                50 | high       | partial E2E coverage | No keyboard/overflow coverage            |
| Busy                          |                1 |          1 |            1 |              60 |                55 | medium     | partial E2E coverage | Busy-state permutations thin             |
| Button                        |                1 |          1 |            1 |              80 |                75 | high       | broad E2E coverage   | Limited focus/disabled-click matrix      |
| Checkbox                      | 2 incl. indirect |          1 |            1 |              75 |                70 | high       | broad E2E coverage   | Validation interplay limited             |
| Checkbox Group                | 2 incl. indirect |          1 |            1 |              60 |                55 | medium     | partial E2E coverage | Weak keyboard/group ARIA coverage        |
| Color Picker                  |                0 |          0 |            0 |               0 |                 0 | low        | no E2E coverage      | Completely untested                      |
| Chips                         |                1 |          1 |            1 |              75 |                70 | high       | broad E2E coverage   | No keyboard interaction coverage         |
| Content                       |                1 |          0 |            0 |              45 |                35 | high       | partial E2E coverage | No a11y/visual and few branches          |
| Date Picker                   | 2 incl. indirect |          0 |            1 |              75 |                70 | medium     | broad E2E coverage   | No direct a11y scan                      |
| Date Time Picker              | 2 incl. indirect |  1 partial |            1 |              55 |                50 | medium     | partial E2E coverage | Base a11y tests skipped                  |
| DragDrop / DnD                |         0 active |          1 |     0 active |              10 |                 5 | low        | no E2E coverage      | No functional drag/drop tests            |
| Dialog                        |                1 |          1 |            1 |              80 |                75 | high       | broad E2E coverage   | Stacked/service coverage thin            |
| Divider                       |                1 |          1 |            0 |              65 |                60 | high       | partial E2E coverage | No visual suite                          |
| Expander                      |                1 |          1 |            1 |              70 |                65 | high       | partial E2E coverage | No keyboard/focus coverage               |
| Form Field                    |                1 |          1 |            1 |              75 |                65 | high       | broad E2E coverage   | Some enable-path gaps skipped            |
| Freetype Query Builder        |                1 |          1 |     0 active |              70 |                60 | medium     | partial E2E coverage | Visual suite skipped                     |
| Icon                          |                1 |          1 |            1 |              60 |                55 | high       | partial E2E coverage | Semantic/accessibility permutations thin |
| Image                         |                1 |          1 |            1 |              55 |                50 | high       | partial E2E coverage | Error/fallback/loading states absent     |
| Layout                        |                1 |          0 |            1 |              45 |                35 | medium     | partial E2E coverage | Resizing only; weak variant coverage     |
| Menu                          |                1 |          1 |            1 |              75 |                70 | high       | broad E2E coverage   | `HOME`/`END` cases skipped               |
| Message                       |                1 |          1 |            1 |              60 |                55 | high       | partial E2E coverage | No live-region/timing coverage           |
| Overlay                       |       6 indirect |          0 |            0 |              35 |                25 | low        | partial E2E coverage | No direct public-contract tests          |
| Paginator                     |                1 |          1 |            1 |              60 |                55 | medium     | partial E2E coverage | Keyboard behavior thin                   |
| Panel                         |                1 |          1 |            1 |              70 |                65 | medium     | partial E2E coverage | Few nested/combined cases                |
| Popover                       |                1 |          1 |            1 |              75 |                70 | high       | broad E2E coverage   | Keyboard-only dismissal thin             |
| Popup                         |                1 |          0 |            0 |              50 |                40 | medium     | partial E2E coverage | Deprecated path under-covered            |
| Progress                      |                1 |          1 |            1 |              55 |                50 | medium     | partial E2E coverage | Minimal state matrix                     |
| Radio Group                   | 2 incl. indirect |          1 |            1 |              50 |                45 | medium     | partial E2E coverage | Keyboard/event coverage thin             |
| Repeat                        | 2 incl. indirect |          0 |            1 |              70 |                65 | medium     | broad E2E coverage   | No direct a11y suite                     |
| Risk Score                    |                0 |          0 |            0 |               0 |                 0 | low        | no E2E coverage      | Completely untested                      |
| Search                        | 3 incl. indirect |          1 |            1 |              60 |                55 | medium     | partial E2E coverage | Debounce/empty-state matrix missing      |
| Select (legacy)               |         0 active |          0 |            0 |               5 |                 0 | low        | no E2E coverage      | Dedicated suite not migrated             |
| Combobox (legacy)             |                1 |          0 |            0 |              75 |                70 | medium     | broad E2E coverage   | No a11y/visual on deprecated path        |
| Select V2                     | 2 incl. indirect |          1 |            1 |              80 |                75 | high       | broad E2E coverage   | Variant matrix not exhaustive            |
| Combobox V2                   | 2 incl. indirect |          1 |            1 |              80 |                75 | high       | broad E2E coverage   | No async/create-option coverage          |
| Selector                      | 2 incl. indirect |          0 |            0 |              60 |                55 | medium     | partial E2E coverage | No a11y/visual suites                    |
| Sorter                        | 2 incl. indirect |          1 |            1 |              65 |                60 | high       | partial E2E coverage | Programmatic states thin                 |
| Spinner                       |                1 |          1 |            1 |              50 |                45 | medium     | partial E2E coverage | Delayed-display case skipped             |
| Switch                        | 2 incl. indirect |          1 |            1 |              60 |                55 | high       | partial E2E coverage | Form/label states thin                   |
| Tab Group / Tab Heading Group |                1 |          1 |            1 |              60 |                55 | medium     | partial E2E coverage | Arrow/Home/End coverage missing          |
| Table                         | 2 incl. indirect |          1 |            1 |              85 |                80 | high       | broad E2E coverage   | Combined-state cases thin                |
| Textbox                       | 4 incl. indirect |          1 |            1 |              50 |                40 | medium     | partial E2E coverage | Async validation commented out           |
| Textbox Number                | 3 incl. indirect |          1 |            1 |              75 |                70 | high       | broad E2E coverage   | One decrement case skipped               |
| Time Frame Bar                |                1 |          1 |            1 |              60 |                55 | medium     | partial E2E coverage | No keyboard/ARIA state coverage          |
| Time Frame Picker             | 2 incl. indirect |          1 |            1 |              65 |                60 | medium     | partial E2E coverage | Timezone/preset edge cases missing       |
| Time Picker                   | 3 incl. indirect |          1 |            1 |              65 |                55 | medium     | partial E2E coverage | AM/PM parsing cases commented out        |
| Toast                         |                0 |          0 |            0 |               0 |                 0 | low        | no E2E coverage      | Lifecycle/dismiss/progress untested      |
| Toolbar                       |                1 |          1 |            1 |              70 |                65 | medium     | partial E2E coverage | Overflow keyboard/menu behavior thin     |
| Tooltip                       |       2 indirect |          0 |            0 |              15 |                10 | low        | no E2E coverage      | No direct trigger/ellipsis/ESC tests     |
| Validation Message            |       1 indirect |          0 |            0 |              10 |                 5 | low        | no E2E coverage      | `show`/`for` behavior untested directly  |
| Wizard                        |                1 |          1 |            1 |              80 |                75 | high       | broad E2E coverage   | Keyboard-only step navigation thin       |
| Wizard V2                     |                1 |          0 |            1 |              60 |                55 | medium     | partial E2E coverage | No a11y suite                            |

## Per-component reports

### Breadcrumb

- Source files reviewed: `packages/bits/src/lib/breadcrumb/breadcrumb.component.ts`
- Tests found: `breadcrumb.e2e.spec.ts`, `breadcrumb.a11y.spec.ts`, `breadcrumb.visual.spec.ts`
- Covered behaviors: empty/root state, short trail rendering, link vs non-link, route updates
- Uncovered or weakly covered behaviors: separators, long trails, keyboard focus
- Line coverage: 55% estimated
- Branch coverage: 50% estimated
- Confidence: high
- Risk summary: deeper breadcrumb permutations can regress unnoticed.

### Busy

- Source files reviewed: `packages/bits/src/lib/busy/busy.component.ts`
- Tests found: `busy.e2e.spec.ts`, `busy.a11y.spec.ts`, `busy.visual.spec.ts`
- Covered behaviors: active/inactive, spinner vs progress mode, popup overlap, focus trapping
- Uncovered or weakly covered behaviors: nested busy regions, custom messages, teardown timing
- Line coverage: 60% estimated
- Branch coverage: 55% estimated
- Confidence: medium
- Risk summary: overlay and focus regressions are only sampled.

### Button

- Source files reviewed: `packages/bits/src/lib/button/button.component.ts`
- Tests found: `button.e2e.spec.ts`, `button.a11y.spec.ts`, `button.visual.spec.ts`
- Covered behaviors: size/style variants, fallback style, disabled, icons, busy state, mouse and keyboard activation, width behavior
- Uncovered or weakly covered behaviors: focus ring, submit/reset semantics, full disabled-click matrix
- Line coverage: 80% estimated
- Branch coverage: 75% estimated
- Confidence: high
- Risk summary: low.

### Checkbox / Checkbox Group

- Source files reviewed: `packages/bits/src/lib/checkbox/checkbox.component.ts`, `packages/bits/src/lib/checkbox/checkbox-group.component.ts`
- Tests found: `checkbox.*`, `checkbox-group.*`, indirect `form-field.e2e.spec.ts`
- Covered behaviors: toggle, disabled, required, indeterminate, prechecked values, justified width, disabled items
- Uncovered or weakly covered behaviors: keyboard traversal, validation summaries, event emission, dynamic item changes
- Line coverage: Checkbox 75% estimated; Checkbox Group 60% estimated
- Branch coverage: Checkbox 70% estimated; Checkbox Group 55% estimated
- Confidence: high / medium
- Risk summary: group interaction and validation edge cases remain under-covered.

### Color Picker

- Source files reviewed: `packages/bits/src/lib/color-picker/color-picker.component.ts`
- Tests found: none
- Covered behaviors: none
- Uncovered or weakly covered behaviors: palette selection, contrast tick, overlay width, select integration, form control behavior
- Line coverage: 0% estimated
- Branch coverage: 0% estimated
- Confidence: low
- Risk summary: public UI surface has no active E2E evidence.

### Chips

- Source files reviewed: `packages/bits/src/lib/chips/chips.component.ts`, `packages/bits/src/lib/chips/chip/chip.component.ts`, `packages/bits/src/lib/chips/chips-overflow/chips-overflow.component.ts`
- Tests found: `chips.e2e.spec.ts`, `chips.a11y.spec.ts`, `chips.visual.spec.ts`
- Covered behaviors: flat/grouped layouts, auto-hide, clear all, overflow count and popover, chip removal
- Uncovered or weakly covered behaviors: keyboard removal, custom classes, async item updates
- Line coverage: 75% estimated
- Branch coverage: 70% estimated
- Confidence: high
- Risk summary: low.

### Content

- Source files reviewed: `packages/bits/src/lib/content/content.component.ts`
- Tests found: `content.e2e.spec.ts`
- Covered behaviors: projected content render, click-through update, scrollbar presence
- Uncovered or weakly covered behaviors: accessibility, resize changes, nested scrolling
- Line coverage: 45% estimated
- Branch coverage: 35% estimated
- Confidence: high
- Risk summary: container regressions may slip.

### Date Picker / Date Time Picker / Time Picker

- Source files reviewed: `packages/bits/src/lib/date-picker/date-picker.component.ts`, `packages/bits/src/lib/date-time-picker/date-time-picker.component.ts`, `packages/bits/src/lib/time-picker/time-picker.component.ts`
- Tests found: `datepicker.*`, `datetimepicker.*`, `timepicker.*`, indirect `form-field.e2e.spec.ts`
- Covered behaviors: open/close, navigation, parsing/formatting, min/max restrictions, disabled state, value propagation, custom formats
- Uncovered or weakly covered behaviors: direct date-picker a11y, base date-time picker a11y, timezone/locale branches, commented AM/PM parser cases
- Line coverage: Date Picker 75% estimated; Date Time Picker 55% estimated; Time Picker 65% estimated
- Branch coverage: Date Picker 70% estimated; Date Time Picker 50% estimated; Time Picker 55% estimated
- Confidence: medium
- Risk summary: temporal components have meaningful uncovered edge cases.

### DragDrop / DnD

- Source files reviewed: `packages/bits/src/lib/dragdrop/draggable.component.ts`, `packages/bits/src/lib/dragdrop/droppable.component.ts`
- Tests found: `drag-and-drop.a11y.spec.ts`; visual is skipped; no active functional spec
- Covered behaviors: only axe scans of draggable/list shells
- Uncovered or weakly covered behaviors: actual drag success/failure, handle/preview behavior, event emission
- Line coverage: 10% estimated
- Branch coverage: 5% estimated
- Confidence: low
- Risk summary: drag and drop behavior is effectively untested.

### Dialog

- Source files reviewed: `packages/bits/src/lib/dialog/dialog.component.ts`, `packages/bits/src/lib/dialog/confirmation-dialog.component.ts`
- Tests found: `dialog.e2e.spec.ts`, `dialog.a11y.spec.ts`, `dialog.visual.spec.ts`
- Covered behaviors: open, severity, custom class, ESC/static backdrop, route change dismissal, focus trap, outside mouseup regression, embedded overlays
- Uncovered or weakly covered behaviors: stacked dialogs, service-level flows
- Line coverage: 80% estimated
- Branch coverage: 75% estimated
- Confidence: high
- Risk summary: low.

### Divider / Expander

- Source files reviewed: `packages/bits/src/lib/divider/divider.component.ts`, `packages/bits/src/lib/expander/expander.component.ts`
- Tests found: `divider.*`, `expander.*`
- Covered behaviors: divider orientation and size variants; expander expand/collapse, icon swap, DOM removal, `openChange`
- Uncovered or weakly covered behaviors: divider visual regression, expander keyboard and focus restoration
- Line coverage: Divider 65% estimated; Expander 70% estimated
- Branch coverage: Divider 60% estimated; Expander 65% estimated
- Confidence: high
- Risk summary: mostly sound, but interaction coverage is incomplete.

### Form Field

- Source files reviewed: `packages/bits/src/lib/form-field/form-field.component.ts`
- Tests found: `form-field.e2e.spec.ts`, `form-field.a11y.spec.ts`, `form-field.visual.spec.ts`
- Covered behaviors: hint/info templates, `aria-label` propagation, disabled/enabled propagation, timepicker icon focus, datetime model update
- Uncovered or weakly covered behaviors: some enable-path cases are skipped, validation-message specifics remain thin
- Line coverage: 75% estimated
- Branch coverage: 65% estimated
- Confidence: high
- Risk summary: integration quality is decent, but not exhaustive.

### Freetype Query Builder

- Source files reviewed: `packages/bits/src/lib/freetype-query-builder/freetype-query-builder.component.ts`
- Tests found: `freetype-query-builder.e2e.spec.ts`, `freetype-query-builder.a11y.spec.ts`; visual skipped
- Covered behaviors: option selection and filtering, in-query replacement, paste newline filtering
- Uncovered or weakly covered behaviors: visual coverage, caret/IME/undo behavior
- Line coverage: 70% estimated
- Branch coverage: 60% estimated
- Confidence: medium
- Risk summary: editing edge cases remain under-covered.

### Icon / Image

- Source files reviewed: `packages/bits/src/lib/icon/icon.component.ts`, `packages/bits/src/lib/image/image.component.ts`
- Tests found: `icon.*`, `image.*`
- Covered behaviors: icon sizes/statuses/counters/coloring; image float/margins/custom sizing/SVG sizing
- Uncovered or weakly covered behaviors: icon semantic roles; image fallback/error/loading states
- Line coverage: Icon 60% estimated; Image 55% estimated
- Branch coverage: Icon 55% estimated; Image 50% estimated
- Confidence: high
- Risk summary: presentation regressions are only partially covered.

### Layout

- Source files reviewed: `packages/bits/src/lib/layout/public-api.ts`
- Tests found: `layout.e2e.spec.ts`, `layout.visual.spec.ts`
- Covered behaviors: border resizing in multiple directions
- Uncovered or weakly covered behaviors: card/group/sheet variants, a11y, more composition scenarios
- Line coverage: 45% estimated
- Branch coverage: 35% estimated
- Confidence: medium
- Risk summary: public layout area is much broader than its tests.

### Menu / Popup / Popover / Overlay

- Source files reviewed: `packages/bits/src/lib/menu/public-api.ts`, `packages/bits/src/lib/popup/popup.component.ts`, `packages/bits/src/lib/popup-adapter/popup-adapter.component.ts`, `packages/bits/src/lib/popover/public-api.ts`, `packages/bits/src/lib/overlay/public-api.ts`
- Tests found: `menu.*`, `popup.e2e.spec.ts`, `popover.*`, indirect overlay coverage from popup/popover/select-v2/timepicker
- Covered behaviors: menu groups and keyboard paths, popup open/close and body attach, popover trigger and placement matrix, some overlay container handling
- Uncovered or weakly covered behaviors: direct overlay contract tests, deprecated popup parity, keyboard-only dismissal depth
- Line coverage: Menu 75%; Popup 50%; Popover 75%; Overlay 35% estimated
- Branch coverage: Menu 70%; Popup 40%; Popover 70%; Overlay 25% estimated
- Confidence: high / medium / high / low
- Risk summary: wrappers are covered better than the base overlay contract.

### Message / Progress / Spinner

- Source files reviewed: `packages/bits/src/lib/message/message.component.ts`, `packages/bits/src/lib/progress/progress.component.ts`, `packages/bits/src/lib/spinner/spinner.component.ts`
- Tests found: `message.*`, `progress.*`, `spinner.*`
- Covered behaviors: type classes and dismissal; progress cancel/close affordances; spinner visibility and size variants
- Uncovered or weakly covered behaviors: live-region timing, value/state matrix, delayed-display branch
- Line coverage: Message 60%; Progress 55%; Spinner 50% estimated
- Branch coverage: Message 55%; Progress 50%; Spinner 45% estimated
- Confidence: medium-high
- Risk summary: utility feedback components have shallow state coverage.

### Paginator / Panel

- Source files reviewed: `packages/bits/src/lib/paginator/paginator.component.ts`, `packages/bits/src/lib/panel/panel.component.ts`
- Tests found: `paginator.*`, `panel.*`
- Covered behaviors: page activation, ellipsis popup, prev/next; collapse, floating panel, resize logic, percent width on resize
- Uncovered or weakly covered behaviors: paginator keyboard and edge disabled states; nested and combined panel modes
- Line coverage: Paginator 60%; Panel 70% estimated
- Branch coverage: Paginator 55%; Panel 65% estimated
- Confidence: medium
- Risk summary: moderate.

### Radio Group / Selector / Sorter / Switch

- Source files reviewed: `packages/bits/src/lib/radio/radio-group.component.ts`, `packages/bits/src/lib/selector/selector.component.ts`, `packages/bits/src/lib/sorter/sorter.component.ts`, `packages/bits/src/lib/switch/switch.component.ts`
- Tests found: `radio-group.*`, `selector.e2e.spec.ts`, `sorter.*`, `switch.*`
- Covered behaviors: initial value and disabled state handling, selector indeterminate state, sorter list and key selection, switch toggle and disabled retention
- Uncovered or weakly covered behaviors: keyboard radio navigation, selector a11y/visual, sorter programmatic states, switch label/form semantics
- Line coverage: Radio Group 50%; Selector 60%; Sorter 65%; Switch 60% estimated
- Branch coverage: Radio Group 45%; Selector 55%; Sorter 60%; Switch 55% estimated
- Confidence: medium
- Risk summary: foundational control behavior is only partly covered.

### Repeat / Search / Table / Toolbar

- Source files reviewed: `packages/bits/src/lib/repeat/public-api.ts`, `packages/bits/src/lib/search/search.component.ts`, `packages/bits/src/lib/table/public-api.ts`, `packages/bits/src/lib/toolbar/toolbar.component.ts`
- Tests found: `repeat.*`, `search.*`, `table.*`, `toolbar.*`
- Covered behaviors: repeat virtual and selection flows, search interaction and integration, broad table feature matrix, toolbar overflow and resize behavior
- Uncovered or weakly covered behaviors: repeat a11y, search debounce/empty-state matrix, combined table states, toolbar keyboard overflow navigation
- Line coverage: Repeat 70%; Search 60%; Table 85%; Toolbar 70% estimated
- Branch coverage: Repeat 65%; Search 55%; Table 80%; Toolbar 65% estimated
- Confidence: medium-high
- Risk summary: table is strong; the other container/integration areas remain partial.

### Select (legacy) / Combobox (legacy) / Select V2 / Combobox V2

- Source files reviewed: `packages/bits/src/lib/select/select.component.ts`, `packages/bits/src/lib/select/combobox/combobox.component.ts`, `packages/bits/src/lib/select-v2/select/select-v2.component.ts`, `packages/bits/src/lib/select-v2/combobox-v2/combobox-v2.component.ts`
- Tests found: inactive `select.e2e.spec.ts`, active `combobox.e2e.spec.ts`, `select-v2.*`, `combobox-v2.*`
- Covered behaviors: legacy combobox selection/typeahead; broad select-v2 and combobox-v2 keyboard, overlay, custom-control, grouped and multiselect flows
- Uncovered or weakly covered behaviors: legacy select is effectively unowned; combobox-v2 async/create-option and broader template/value cases
- Line coverage: Select 5%; Combobox 75%; Select V2 80%; Combobox V2 80% estimated
- Branch coverage: Select 0%; Combobox 70%; Select V2 75%; Combobox V2 75% estimated
- Confidence: low to high
- Risk summary: modern v2 controls are strong; deprecated legacy select is a major gap.

### Tab Group / Textbox / Textbox Number

- Source files reviewed: tabgroup exports in `packages/bits/src/public_api.ts`, `packages/bits/src/lib/textbox/textbox.component.ts`, `packages/bits/src/lib/textbox/textbox-number/textbox-number.component.ts`
- Tests found: `tab-heading-group.*`, `textbox.*`, `textbox-number.*`
- Covered behaviors: tab switching and responsive navigation, textbox base states, textbox-number increments/min-max/reactive forms
- Uncovered or weakly covered behaviors: tab arrow/home/end keyboard support, textbox async validation, one skipped textbox-number decrement case
- Line coverage: Tab Group 60%; Textbox 50%; Textbox Number 75% estimated
- Branch coverage: Tab Group 55%; Textbox 40%; Textbox Number 70% estimated
- Confidence: medium-high
- Risk summary: numeric input is solid; tab/text validation paths are weaker.

### Time Frame Bar / Time Frame Picker

- Source files reviewed: `packages/bits/src/lib/convenience/time-frame-bar/time-frame-bar.component.ts`, `packages/bits/src/lib/time-frame-picker/public-api.ts`
- Tests found: `time-frame-bar.*`, `time-frame-picker.*`
- Covered behaviors: prev/next, undo/clear, reset logic, quick picks, min time/date constraints, filtering integration
- Uncovered or weakly covered behaviors: keyboard access, ARIA states, timezone boundaries, broader preset dictionaries
- Line coverage: Time Frame Bar 60%; Time Frame Picker 65% estimated
- Branch coverage: Time Frame Bar 55%; Time Frame Picker 60% estimated
- Confidence: medium
- Risk summary: date-range semantics still need edge-case coverage.

### Toast / Tooltip / Validation Message

- Source files reviewed: `packages/bits/src/lib/toast/toast.component.ts`, `packages/bits/src/lib/tooltip/tooltip.directive.ts`, `packages/bits/src/lib/tooltip/tooltip.component.ts`, `packages/bits/src/lib/validation-message/validation-message.component.ts`
- Tests found: no direct toast tests; tooltip and validation-message only indirect usage
- Covered behaviors: minimal indirect tooltip and validation rendering paths only
- Uncovered or weakly covered behaviors: nearly all direct public behavior for all three areas
- Line coverage: Toast 0%; Tooltip 15%; Validation Message 10% estimated
- Branch coverage: Toast 0%; Tooltip 10%; Validation Message 5% estimated
- Confidence: low
- Risk summary: these exported surfaces are major blind spots.

### Wizard / Wizard V2

- Source files reviewed: `packages/bits/src/lib/wizard/public-api.ts`, `packages/bits/src/lib/wizard-v2/public-api.ts`
- Tests found: `wizard.*`, `wizard-v2.e2e.spec.ts`, `wizard-v2.visual.spec.ts`
- Covered behaviors: step counts, navigation, validation, dynamic steps, dialog embedding, restored state
- Uncovered or weakly covered behaviors: keyboard-only step navigation, wizard-v2 a11y, overflow/validation breadth
- Line coverage: Wizard 80%; Wizard V2 60% estimated
- Branch coverage: Wizard 75%; Wizard V2 55% estimated
- Confidence: high / medium
- Risk summary: v1 is strong; v2 still needs broader accessibility and validation coverage.

## Final findings

### Top 10 weakest-covered components

1. Toast
2. Color Picker
3. Select (legacy)
4. Tooltip
5. DragDrop / DnD
6. Overlay
7. Validation Message
8. Risk Score
9. Popup
10. Content

### Components with zero E2E coverage

- Color Picker
- Risk Score
- Toast

### Components with effectively no direct component-owned coverage

- Select (legacy)
- Tooltip
- Validation Message
- DragDrop / DnD
- Overlay

### Components with only `a11y` or effectively non-functional coverage

- DragDrop / DnD is effectively `a11y`-only in active coverage.
- Date Time Picker has an `a11y` file, but important base-picker cases are skipped.
- Freetype Query Builder has a visual file, but the visual test is skipped.

### Recommended next tests to add, ranked by impact

1. Toast: timeout, hover pause/resume, click-to-dismiss, sticky mode, progress bar
2. Select (legacy): migrate or replace the inactive Playwright suite
3. Tooltip: direct hover/focus/ESC/ellipsis/disabled/placement coverage
4. Color Picker: palette/plain array, contrast tick, overlay width, form-control read/write
5. DragDrop / DnD: actual drag success/reject and event emission
6. Overlay: direct `clickOutside`, `customContainer`, `roleAttr`, `empty$` tests
7. Validation Message: direct `show` and `for` tests
8. Risk Score: clamp, invalid min/max, resize recalculation
9. Time Picker: restore AM/PM parser cases
10. Textbox: restore async validation coverage

## Overall assessment

Strongest areas: Button, Dialog, Select V2, Combobox V2, Table, Wizard.

Weakest areas: Toast, Color Picker, Select (legacy), Tooltip, Overlay, Validation Message, Risk Score, DragDrop / DnD.
