export interface A11yGraphicOptions {
    decorative?: boolean; // undefined treated as true by caller if desired
    explicitRole?: "img" | "presentation" | null;
    label?: string | null;
    hasAlt?: boolean; // true if native <img alt> exists
    statusParts?: string[]; // additional semantic qualifiers (statuses)
}

export interface A11yGraphicResult {
    role: string | null;
    ariaHidden: string | null;
    ariaLabel: string | null;
}

/**
 * Computes role, aria-hidden, and aria-label for graphics (icons/images) with consistent rules:
 * - Decorative defaults to presentation + aria-hidden
 * - role="img" only if a non-empty accessible name is available
 * - Explicit role overrides are honored but guarded against invalid accessible name cases
 */
export function computeA11yForGraphic(
    opts: A11yGraphicOptions
): A11yGraphicResult {
    const decorative = opts.decorative !== false; // undefined => decorative
    const normalizedLabel = normalizeLabel(
        decorative ? null : opts.label ?? null
    );
    const statusLabel = buildStatusLabel(normalizedLabel, opts.statusParts);

    let role: string | null = null;
    if (decorative) {
        role = "presentation";
    } else if (opts.explicitRole) {
        if (opts.explicitRole === "img") {
            role = normalizedLabel ? "img" : null;
        } else if (opts.explicitRole === "presentation") {
            role = "presentation";
        }
    } else {
        // Infer role from presence of alt or label
        if (opts.hasAlt || normalizedLabel) {
            role = "img";
        } else {
            role = "presentation";
        }
    }

    const ariaHidden = role !== "img" ? "true" : null;

    // Provide aria-label only if role is img, no native alt, and we have a label
    const ariaLabel = role === "img" && !opts.hasAlt ? statusLabel : null;

    return { role, ariaHidden, ariaLabel };
}

function normalizeLabel(raw: string | null | undefined): string | null {
    if (!raw) {
        return null;
    }
    const trimmed = raw.trim();
    return trimmed.length ? trimmed : null;
}

function buildStatusLabel(
    base: string | null,
    parts?: string[]
): string | null {
    if (!base) {
        return null;
    }
    const valid = (parts || []).map((p) => p?.trim()).filter((p) => !!p);
    return valid.length ? `${base} ${valid.join(" ")}` : base;
}
