"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";

/**
 * Runs `setup` inside a gsap.context() scoped to `scope`, and reverts
 * (killing all tweens/ScrollTriggers created inside) on unmount.
 * Respects prefers-reduced-motion by exposing `reduced` to the callback.
 */
export function useGsapContext<T extends HTMLElement>(
  setup: (context: { reduced: boolean }) => void,
  deps: React.DependencyList = [],
): RefObject<T> {
  const scope = useRef<T>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => setup({ reduced }), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
