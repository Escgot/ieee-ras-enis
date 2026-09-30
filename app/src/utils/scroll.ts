/**
 * Scroll utility for custom section offset handling across the application.
 * Supports butter-smooth Lenis scrolling when available with native smooth fallback.
 */

// Custom pixel offsets per section (currently all set to 0px as requested)
export const SECTION_OFFSETS: Record<string, number> = {
  '#home': 0,
  '#about': 0,
  '#news': 0,
  '#gallery': 0,
  '#events': 0,
  '#projects': 0,
  '#team': 0,
  '#shop': 0,
  '#contact': 0,
};

/**
 * Scrolls to a section element with exact custom pixel offset.
 *
 * @param target Selector string (e.g. '#about', 'about', or '#home')
 * @param customOffset Optional override offset in pixels
 * @param onStart Optional callback fired before scroll begins
 * @param onComplete Optional callback fired after scroll finishes
 */
export function scrollToSectionWithOffset(
  target: string,
  customOffset?: number,
  onStart?: () => void,
  onComplete?: () => void
) {
  const cleanTarget = target.trim();
  if (cleanTarget === '#home' || cleanTarget === 'home' || cleanTarget === '#' || cleanTarget === '') {
    if (onStart) onStart();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: Record<string, unknown>) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1, onComplete });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (onComplete) setTimeout(onComplete, 800);
    }
    return;
  }

  const selector = cleanTarget.startsWith('#') ? cleanTarget : `#${cleanTarget}`;
  const element = document.querySelector(selector) as HTMLElement | null;

  if (!element) return;

  const offset = customOffset !== undefined ? customOffset : (SECTION_OFFSETS[selector] ?? 0);

  const rect = element.getBoundingClientRect();
  const targetY = Math.max(0, rect.top + window.scrollY - offset);

  if (onStart) onStart();

  const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: Record<string, unknown>) => void } }).__lenis;
  if (lenis) {
    lenis.scrollTo(targetY, { duration: 1.1, onComplete });
  } else {
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    if (onComplete) setTimeout(onComplete, 800);
  }
}
