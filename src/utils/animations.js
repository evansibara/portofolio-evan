/**
 * Animation presets for anime.js
 * Centralized configs so animations feel consistent across the app.
 */
import anime from 'animejs';

// Easing curves
export const easing = {
  smooth: 'cubicBezier(0.33, 1, 0.68, 1)',
  snappy: 'cubicBezier(0.65, 0, 0.35, 1)',
  bounce: 'spring(1, 80, 10, 0)',
};

// Stagger reveal — typically used on text split into characters/words
export const staggerReveal = (targets, opts = {}) =>
  anime({
    targets,
    opacity: [0, 1],
    translateY: [60, 0],
    duration: 900,
    delay: anime.stagger(40, { start: opts.start ?? 0 }),
    easing: easing.smooth,
    ...opts,
  });

// Fade-up for full elements
export const fadeUp = (targets, opts = {}) =>
  anime({
    targets,
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    easing: easing.smooth,
    ...opts,
  });

// Fade-in simple
export const fadeIn = (targets, opts = {}) =>
  anime({
    targets,
    opacity: [0, 1],
    duration: 600,
    easing: 'linear',
    ...opts,
  });

// Scale in with slight rotation — for project cards
export const scaleIn = (targets, opts = {}) =>
  anime({
    targets,
    opacity: [0, 1],
    scale: [0.96, 1],
    duration: 700,
    delay: anime.stagger(80),
    easing: easing.smooth,
    ...opts,
  });

// Split text into spans for per-character animation
export const splitText = (element) => {
  if (!element) return [];
  const text = element.textContent;
  element.innerHTML = '';
  const spans = [...text].map((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, opacity';
    element.appendChild(span);
    return span;
  });
  return spans;
};

export default { staggerReveal, fadeUp, fadeIn, scaleIn, splitText, easing };
