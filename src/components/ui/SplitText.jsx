import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { useInView } from '@hooks/useInView';

/**
 * SplitText — React Bits inspired.
 * Splits text into characters and animates them into view with stagger.
 *
 * Props:
 * - text: string to animate
 * - as: HTML tag to render (h1, h2, p, span, etc)
 * - className: styling
 * - delay: initial delay in ms
 * - stagger: per-char delay in ms
 * - duration: animation duration per char
 */
export default function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 30,
  duration = 800,
}) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const innerRef = useRef(null);

  useEffect(() => {
    if (!inView || !innerRef.current) return;

    const chars = innerRef.current.querySelectorAll('.char');

    anime({
      targets: chars,
      opacity: [0, 1],
      translateY: [40, 0],
      rotateZ: [8, 0],
      duration,
      delay: anime.stagger(stagger, { start: delay }),
      easing: 'cubicBezier(0.33, 1, 0.68, 1)',
    });
  }, [inView, delay, stagger, duration]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span ref={innerRef} aria-hidden="true" className="inline-block">
        {[...text].map((char, i) => (
          <span
            key={i}
            className="char inline-block opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </Tag>
  );
}
