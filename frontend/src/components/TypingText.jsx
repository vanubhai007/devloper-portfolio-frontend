import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Types and deletes words in a loop. Screen readers get the full list once
 * (via sr-only text); the animated text is aria-hidden.
 */
export default function TypingText({ words, typeSpeed = 70, deleteSpeed = 40, pause = 1600, className }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return undefined;
    const word = words[index % words.length];
    let timeout;
    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === '') {
      timeout = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }, 250);
    } else {
      timeout = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deleteSpeed : typeSpeed,
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause, reduce]);

  return (
    <span className={className}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true">
        {reduce ? words[0] : text}
        <span style={{ color: 'var(--primary)', animation: 'blink 1s step-end infinite', marginLeft: 2 }}>|</span>
      </span>
    </span>
  );
}
