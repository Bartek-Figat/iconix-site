import type { IconFlip, IconOptions, IconVariant } from '@iconix/icons';

/** Everything the customizer can change. */
export interface Custom {
  size: number;
  color: string;
  strokeWidth: number;
  variant: IconVariant;
  background: string;
  rotate: number;
  flip: '' | IconFlip;
  absoluteStrokeWidth: boolean;
}

export const DEFAULTS: Custom = {
  size: 24,
  color: 'currentColor',
  strokeWidth: 2,
  variant: 'default',
  background: '',
  rotate: 0,
  flip: '',
  absoluteStrokeWidth: false,
};

export const pascal = (name: string) =>
  name.split('-').filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join('');

/** Only the options that differ from the defaults (what you would actually write). */
export function toOptions(c: Custom): IconOptions {
  const o: IconOptions = {};
  if (c.size !== DEFAULTS.size) o.size = c.size;
  if (c.color !== DEFAULTS.color) o.color = c.color;
  if (c.strokeWidth !== DEFAULTS.strokeWidth) o.strokeWidth = c.strokeWidth;
  if (c.absoluteStrokeWidth) o.absoluteStrokeWidth = true;
  if (c.variant !== 'default') o.variant = c.variant;
  if (c.background) o.background = c.background;
  if (c.rotate) o.rotate = c.rotate;
  if (c.flip) o.flip = c.flip;
  return o;
}

type Entry = [key: string, value: string | number | boolean];
const entries = (c: Custom): Entry[] => Object.entries(toOptions(c)) as Entry[];
const kebab = (k: string) => k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

/** Props on one line when short, otherwise one per line. */
function layout(props: string[], indent: string): string {
  if (props.length <= 2) return props.map((p) => ' ' + p).join('');
  return props.map((p) => `\n${indent}  ${p}`).join('') + `\n${indent}`;
}

function jsxProps(c: Custom, indent = ''): string {
  return layout(entries(c)
    .map(([k, v]) => (typeof v === 'string' ? `${k}="${v}"` : v === true ? k : `${k}={${v}}`)), indent);
}

function vueProps(c: Custom, indent = ''): string {
  return layout(entries(c)
    .map(([k, v]) => {
      const name = kebab(k);
      if (typeof v === 'string') return `${name}="${v}"`;
      if (v === true) return name;
      return `:${name}="${v}"`;
    }), indent);
}

function htmlAttrs(c: Custom): string {
  return layout(entries(c).map(([k, v]) => (v === true ? kebab(k) : `${kebab(k)}="${v}"`)), '');
}

function jsObject(c: Custom): string {
  const e = entries(c);
  if (!e.length) return '';
  return ', { ' + e.map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`).join(', ') + ' }';
}

function cliFlags(c: Custom): string {
  const multi = entries(c).length > 2;
  const map: Record<string, string> = {
    size: '--size', color: '--color', strokeWidth: '--stroke-width', absoluteStrokeWidth: '--absolute-stroke-width',
    variant: '--variant', background: '--background', rotate: '--rotate', flip: '--flip',
  };
  return entries(c)
    .map(([k, v]) => (v === true ? map[k] : `${map[k]} ${typeof v === 'string' && /[#\s]/.test(v) ? `"${v}"` : v}`))
    .map((p) => (multi ? ' \\\n  ' : ' ') + p)
    .join('');
}

export interface Snippet {
  id: string;
  label: string;
  lang: string;
  where: string;
  code: string;
}

/** Usage examples for one icon with the current customization. */
export function snippets(name: string, c: Custom, svg: string): Snippet[] {
  return buildSnippets(name, c, svg).map((s) => ({ ...s, code: s.code.replace(/\n(\s*) \/>/g, '\n$1/>') }));
}

function buildSnippets(name: string, c: Custom, svg: string): Snippet[] {
  const comp = `Icon${pascal(name)}`;
  const cssColor = c.color === 'currentColor' ? '#2563eb' : c.color;
  return [
    {
      id: 'react', label: 'React', lang: 'tsx',
      where: 'React apps (16.8+, including 19): Vite, Create React App, Remix / React Router, Gatsby, Expo Web. Only the icons you import end up in your bundle.',
      code: `import { ${comp} } from '@iconix/icons/react';

export function Example() {
  return <${comp}${jsxProps(c, '  ')} />;
}`,
    },
    {
      id: 'next', label: 'Next.js', lang: 'tsx',
      where: 'Next.js App Router and Pages Router. Icons render in Server Components, so you do not need "use client".',
      code: `// app/page.tsx (Server Component)
import { ${comp} } from '@iconix/icons/react';

export default function Page() {
  return (
    <button className="btn">
      <${comp}${jsxProps(c, '      ')} />
      Click me
    </button>
  );
}`,
    },
    {
      id: 'vue', label: 'Vue / Nuxt', lang: 'vue',
      where: 'Vue 3 single-file components, Nuxt 3, Vite + Vue, Quasar. Props are reactive.',
      code: `<script setup lang="ts">
import { ${comp} } from '@iconix/icons/vue';
</script>

<template>
  <${comp}${vueProps(c, '  ')} />
</template>`,
    },
    {
      id: 'html', label: 'HTML', lang: 'html',
      where: 'Any web page without a build step: plain HTML, WordPress, PHP, Django, Rails, Laravel. The Web Component also works in Angular, Svelte, Solid and Astro.',
      code: `<script type="module">
  import { defineIconElement } from 'https://cdn.jsdelivr.net/npm/@iconix/icons/dist/element.js';
  defineIconElement();
</script>

<iconix-icon name="${name}"${htmlAttrs(c)}></iconix-icon>`,
    },
    {
      id: 'js', label: 'JavaScript', lang: 'js',
      where: 'Vanilla JS, Svelte ({@html}), Astro (set:html), Node.js server rendering, emails and PDFs generated on the server.',
      code: `import { toSvg } from '@iconix/icons';

const svg = toSvg('${name}'${jsObject(c)});
document.querySelector('#slot').innerHTML = svg;`,
    },
    {
      id: 'css', label: 'CSS', lang: 'css',
      where: 'Style icons from your stylesheet. Color comes from currentColor and size can follow the font size (1em).',
      code: `/* <${comp} className="icon" size="1em" /> */
.icon {
  color: ${cssColor};          /* stroke color via currentColor */
  font-size: ${c.size}px;         /* 1em = this size */
  stroke-width: ${c.strokeWidth};
  vertical-align: -0.125em; /* line up with text */
  transition: color .15s, transform .15s;
}
.btn:hover .icon {
  color: #1d4ed8;
  transform: scale(1.1);
}`,
    },
    {
      id: 'svg', label: 'SVG', lang: 'svg',
      where: 'Paste straight into HTML, Figma, Illustrator, Inkscape, Webflow, Framer or any tool that accepts SVG.',
      code: svg,
    },
    {
      id: 'cli', label: 'CLI', lang: 'bash',
      where: 'Export ready .svg files for static sites, mobile apps, design tools and documentation.',
      code: `npx @iconix/icons export ${name}${cliFlags(c)}${entries(c).length > 2 ? ' \\\n  ' : ' '}-o icons
# → icons/${name}.svg`,
    },
  ];
}
