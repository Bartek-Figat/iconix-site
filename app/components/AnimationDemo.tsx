'use client';

import { useState } from 'react';
import type { IconName, IconOptions } from '@iconix/icons';
import { Icon, IconPlay, IconRefresh, IconStop } from '@iconix/icons/react';
import { CodeBlock } from './CodeBlock';
import { ANIMS, animClass, type Anim } from '../lib/animations';
import { pascal } from '../lib/snippets';

const SPEEDS = [['Slow', 1.6], ['Normal', 1], ['Fast', 0.6]] as const;

// All demo keyframes, injected once with the popup.
const DEMO_CSS = ANIMS.filter((a) => !a.builtIn).map((a) => a.css(a.duration)).join('\n')
  + `\n.iconix-spin{animation:iconix-spin 1s linear infinite;transform-origin:center}`
  + `\n.iconix-pulse{animation:iconix-spin 1s steps(8) infinite;transform-origin:center}`
  + `\n@keyframes iconix-spin{to{transform:rotate(360deg)}}`;

function usage(a: Anim, name: string, framework: string, d: number, base: number): { code: string; lang: string } {
  const comp = `Icon${pascal(name)}`;
  const cls = animClass(a);
  const custom = d !== base ? ` style={{ animationDuration: '${d}s' }}` : '';
  const customVue = d !== base ? ` style="animation-duration: ${d}s"` : '';
  if (framework === 'vue') {
    return a.builtIn
      ? { lang: 'vue', code: `<script setup lang="ts">\nimport '@iconix/icons/css';\nimport { ${comp} } from '@iconix/icons/vue';\n</script>\n\n<template>\n  <${comp} ${a.builtIn}${customVue} />\n</template>` }
      : { lang: 'vue', code: `<template>\n  <${comp} class="${cls}"${customVue} />\n</template>` };
  }
  if (framework === 'html') {
    return {
      lang: 'html',
      code: a.builtIn
        ? `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@iconix/icons/iconix.css">\n<iconix-icon name="${name}" ${a.builtIn}${d !== base ? ` style="animation-duration: ${d}s"` : ''}></iconix-icon>`
        : `<iconix-icon name="${name}" class="${cls}"${d !== base ? ` style="animation-duration: ${d}s"` : ''}></iconix-icon>`,
    };
  }
  if (framework === 'js') {
    return {
      lang: 'js',
      code: a.builtIn
        ? `import '@iconix/icons/css';\nimport { toSvg } from '@iconix/icons';\n\nel.innerHTML = toSvg('${name}', { ${a.builtIn}: true });`
        : `import { toSvg } from '@iconix/icons';\n\nel.innerHTML = toSvg('${name}', { className: '${cls}' });`,
    };
  }
  return {
    lang: 'tsx',
    code: a.builtIn
      ? `import '@iconix/icons/css';        // once, e.g. in your root layout\nimport { ${comp} } from '@iconix/icons/react';\n\n<${comp} ${a.builtIn}${custom} />`
      : `import { ${comp} } from '@iconix/icons/react';\nimport './icon-animations.css';\n\n<${comp} className="${cls}"${custom} />`,
  };
}

export function AnimationDemo({ name, options, framework }: { name: IconName; options: IconOptions; framework: string }) {
  const [id, setId] = useState('spin');
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [run, setRun] = useState(0); // remount to replay one-shot animations
  const a = ANIMS.find((x) => x.id === id) ?? ANIMS[0];
  const d = Math.round(a.duration * speed * 100) / 100;
  const u = usage(a, name, framework, d, a.duration);
  const color = options.color;

  const start = () => {
    setRun((r) => r + 1);
    setPlaying(a.once ? true : !playing);
  };

  return (
    <div className="anim">
      <style>{DEMO_CSS}</style>
      <div className="anim-head">
        <h3>Animation</h3>
        <div className="segmented anim-speed" role="group" aria-label="Speed">
          {SPEEDS.map(([l, s]) => (
            <button key={l} type="button" className={speed === s ? 'on' : ''} onClick={() => setSpeed(s)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="anim-picker" role="group" aria-label="Animation type">
        {ANIMS.map((x) => (
          <button key={x.id} type="button" className={x.id === id ? 'on' : ''}
            onClick={() => { setId(x.id); setRun((r) => r + 1); }}>
            {x.label}{x.builtIn && <span className="built">built-in</span>}
          </button>
        ))}
      </div>

      <div className="anim-stage" style={{ color }}>
        <div className="anim-icon">
          <Icon
            key={`${id}-${run}`}
            name={name}
            {...options}
            size={72}
            className={playing ? animClass(a) : undefined}
            style={playing ? { animationDuration: `${d}s` } : undefined}
          />
        </div>
        <button type="button" className="btn primary anim-start" onClick={start} aria-pressed={playing}>
          {a.once
            ? <><IconRefresh size={16} /> {playing ? 'Replay' : 'Start'}</>
            : playing ? <><IconStop size={16} /> Stop</> : <><IconPlay size={16} /> Start</>}
        </button>
      </div>

      <p className="where">{a.hint}</p>
      {!a.builtIn && <CodeBlock code={a.css(d)} lang="css" title="icon-animations.css" />}
      <div style={{ height: 10 }} />
      <CodeBlock code={u.code} lang={u.lang} title={a.builtIn ? `Usage (CSS included in @iconix/icons/css)` : 'Usage'} />
    </div>
  );
}
