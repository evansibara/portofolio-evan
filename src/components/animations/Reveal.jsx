import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { useInView } from '@hooks/useInView';

/**
 * Reveal — elegant fade & rise when element enters viewport.
 * Values are tuned for editorial feel: longer duration, smaller movement,
 * refined easing (no bouncy/spring overshoot).
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 1100,
  y = 24,
  className = '',
}) {
  const [ref, inView] = useInView({ threshold: 0.12 });
  const innerRef = useRef(null);

  useEffect(() => {
    if (!inView || !innerRef.current) return;
    anime({
      targets: innerRef.current,
      opacity: [0, 1],
      translateY: [y, 0],
      duration,
      delay,
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  }, [inView, delay, duration, y]);

  return (
    <div ref={ref} className={className}>
      <div
        ref={innerRef}
        style={{ opacity: 0, willChange: 'transform, opacity' }}
      >
        {children}
      </div>
    </div>
  );
}