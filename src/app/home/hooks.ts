"use client";

import { useState, useEffect, type RefObject } from "react";

export function useVisible(ref: RefObject<HTMLElement | null>, threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

export function useCounter(target: number, started: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let n = 0;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      n += step;
      if (n >= target) { setCount(target); clearInterval(id); }
      else setCount(n);
    }, 16);
    return () => clearInterval(id);
  }, [target, started, duration]);
  return count;
}
