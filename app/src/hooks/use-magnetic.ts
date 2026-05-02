import { useEffect } from 'react';

/**
 * Global magnetic effect for all interactive elements.
 * Elements subtly pull toward the cursor on hover, creating
 * an ultra-premium, tactile feel across the entire UI.
 *
 * Targets: buttons, links, [role="button"], .cyber-btn, .magnetic
 * Opt-out: add `data-no-magnetic` attribute to any element.
 */
export function useMagnetic() {
  useEffect(() => {
    const SELECTOR =
      'button, a, [role="button"], .cyber-btn, .magnetic';
    const STRENGTH = 0.35; // 0 = nothing, 1 = glued to cursor
    const RADIUS = 0.6;   // how far outside the element the magnet reaches (fraction of element size)

    const state = new WeakMap<
      HTMLElement,
      { onMove: (e: MouseEvent) => void; onLeave: () => void; raf: number }
    >();

    function attach(el: HTMLElement) {
      if (state.has(el)) return;
      if (el.hasAttribute('data-no-magnetic')) return;
      // Skip very tiny elements (icons inside buttons, etc.)
      if (el.offsetWidth < 16 || el.offsetHeight < 16) return;

      // Preserve any existing transform so we don't clobber it
      const origTransform = el.style.transform;

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.max(rect.width, rect.height) * (0.5 + RADIUS);

        if (dist < maxDist) {
          const pull = 1 - dist / maxDist; // 1 at center, 0 at edge
          const tx = dx * STRENGTH * pull;
          const ty = dy * STRENGTH * pull;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
          el.style.transition = 'transform 0.15s ease-out';
        }
      };

      const onLeave = () => {
        el.style.transform = origTransform || '';
        el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      state.set(el, { onMove, onLeave, raf: 0 });
    }

    function detach(el: HTMLElement) {
      const s = state.get(el);
      if (!s) return;
      el.removeEventListener('mousemove', s.onMove);
      el.removeEventListener('mouseleave', s.onLeave);
      el.style.transform = '';
      state.delete(el);
    }

    // Attach to all currently existing elements
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach(attach);

    // Watch for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches(SELECTOR)) attach(node);
            node.querySelectorAll<HTMLElement>(SELECTOR).forEach(attach);
          }
        });
        m.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches(SELECTOR)) detach(node);
            node.querySelectorAll<HTMLElement>(SELECTOR).forEach(detach);
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(detach);
    };
  }, []);
}
