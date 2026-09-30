# Visual Testing with Playwright and Virtual Camera

This project uses Playwright for visual tests and a thin Virtual Camera API to keep tests clean and portable.

Goals:
- Framework-agnostic test code using Atoms and Helpers
- Centralize visual capture via a Camera (Percy or manual PNGs)
- Stable screenshots (disable animations, consistent widths)

## Setup

- Playwright config at `packages/bits/playwright.config.ts` defines a `visual` project and outputs artifacts to `test-results/`.
- Without `PERCY_TOKEN` (default, also in CI): the Eyes lens saves full-page Playwright screenshots as PNGs to `_snapshots/`.
- With `PERCY_TOKEN`: the Percy lens sends DOM snapshots via `@percy/playwright` (run via `percy exec`); `PERCY_DEFAULT_CONFIG` (widths, `percyCSS`) applies only here.

## Virtual Camera API

Import from `packages/bits/e2e/virtual-camera`:
- `new Camera().loadFilm(page, testName, suiteName?)` – initialize camera
- `camera.turn.on()` / `camera.turn.off()` – enable/disable lens CSS and configuration
- `camera.say.cheese(label)` – capture a snapshot with an optional stabilization delay
- `camera.be.responsive(widths, callback?)` – set responsive widths and optional callback that receives the Playwright `page`

The Camera engine selects the Percy lens only when `process.env.PERCY_TOKEN` is set; otherwise it uses the Eyes lens (PNG screenshots).

### How CI produces Percy snapshots

CircleCI runs the UI tests **without** `PERCY_TOKEN`, so every snapshot is a Playwright screenshot written to `_snapshots/` by the Eyes lens. A later step uploads these images with `percy upload _snapshots`. Consequences:

- Percy does not re-render the page; `percyCSS` and other Percy lens options have no effect in CI.
- Snapshot stability must be ensured before/while the screenshot is taken:
  - `camera.say.cheese()` waits, forces all web fonts to load and waits two animation frames (prevents invisible or shifted text and misplaced overlays/tooltips).
  - The Eyes lens takes screenshots with `animations: "disabled"` and `caret: "hide"`, so infinite CSS animations (spinners, progress bars) are frozen.
- To reproduce CI snapshots locally, run the visual tests without `PERCY_TOKEN` and inspect the PNGs in `_snapshots/`.

## Best Practices

- Animations are frozen by the camera at screenshot time. `Helpers.disableCSSAnimations(...)` injects its styles via `page.addInitScript`, so it only affects pages loaded after the call (not the page already opened by `Helpers.prepareBrowser`).
- Interact via Atoms (see `docs/E2E/ATOMS.md`) to keep tests resilient.
- Use meaningful snapshot labels tied to user actions.
- Prefer consistent viewport widths; set `camera.be.responsive([1920])` as needed.

## Example: Busy Visual Test

```ts
import { test, Helpers, Animations } from "../../setup";
import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { Camera } from "../../virtual-camera/Camera";

const name = "Busy";

test.describe(`Visual tests: ${name}`, () => {
  let switchBusyState: ButtonAtom;

  test.beforeEach(async ({ page }) => {
    await Helpers.prepareBrowser("busy/busy-visual-test", page);
    await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);
    switchBusyState = Atom.find<ButtonAtom>(ButtonAtom, "nui-busy-test-button");
  });

  test(`${name} visual test`, async ({ page }) => {
    const camera = new Camera().loadFilm(page, `${name} visual test`, "Bits");
    await camera.turn.on();

    await camera.say.cheese("initial");

    await switchBusyState.click();
    await camera.say.cheese("busy-state");

    await Helpers.switchDarkTheme("on");
    await camera.say.cheese("dark-theme");
    await Helpers.switchDarkTheme("off");

    await camera.turn.off();
  });
});
```

## Running Visual Tests

- Run the visual project:
```powershell
cd packages/bits
yarn e2e:playwright:base --project=visual
```

- With Percy:
```powershell
cd packages/bits
percy exec -- yarn e2e:playwright:base --project=visual
```

Snapshots will appear in CircleCI artifacts or `_snapshots/` when using manual mode.
