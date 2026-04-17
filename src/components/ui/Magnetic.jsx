import { useRef } from 'react';
import anime from 'animejs';

/**
 * Magnetic — subtle cursor pull. Default strength lowered to 0.15
 * for a more restrained, refined feel (was 0.3, which felt too playful).
 * Return uses pure ease-out (no spring), so it settles calmly.
 */
export default function Magnetic({ children, strength = 0.15, className = '' }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    anime({
      targets: el,
      translateX: x * strength,
      translateY: y * strength,
      duration: 600,
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  };

  const handleMouseLeave = () => {
    anime({
      targets: ref.current,
      translateX: 0,
      translateY: 0,
      duration: 800,
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}