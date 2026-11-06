'use client';

import { useState, type ReactNode } from 'react';
import { IconCheck, IconCopy } from '@iconix/icons/react';

// Tiny syntax highlighter: strings, comments, tags, keywords, numbers.
const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|#[^\n]*$)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`]*`)|(<\/?[A-Za-z][\w.-]*|\/?>)|\b(import|from|export|default|function|return|const|let|await|async|npm|npx|pnpm|yarn|bun)\b|(\b\d+(?:\.\d+)?(?:px|em)?\b)/gm;

function highlight(code: string, lang: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of code.matchAll(TOKEN)) {
    const [text, comment, str, tag, kw, num] = m;
    // "#" is a comment only in shell; in CSS/HTML it's a color.
    if (comment && comment.startsWith('#') && lang !== 'bash') continue;
    if (m.index > last) out.push(code.slice(last, m.index));
    const cls = comment ? 'tk-c' : str ? 'tk-s' : tag ? 'tk-t' : kw ? 'tk-k' : num ? 'tk-n' : '';
    out.push(<span key={i++} className={cls}>{text}</span>);
    last = m.index + text.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="copy-btn"
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? <IconCheck size={15} /> : <IconCopy size={15} />}
      <span>{done ? 'Copied' : label}</span>
    </button>
  );
}

export function CodeBlock({ code, lang, title }: { code: string; lang: string; title?: string }) {
  return (
    <div className="code">
      <div className="code-head">
        <span className="code-lang">{title ?? lang}</span>
        <CopyButton text={code} />
      </div>
      <pre><code>{highlight(code, lang)}</code></pre>
    </div>
  );
}
