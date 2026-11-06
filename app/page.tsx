import { categories, iconNames, type IconName } from '@iconix/icons';
import {
  Icon, IconArrowRight, IconCheckCircle, IconPackage,
} from '@iconix/icons/react';
import { IconGallery } from './components/IconGallery';
import { ThemeToggle } from './components/ThemeToggle';
import { CodeBlock } from './components/CodeBlock';
import { UsageTabs, type UsageTab } from './components/UsageTabs';

const NPM = 'https://www.npmjs.com/package/@iconix/icons';
const COFFEE = 'https://buymeacoffee.com/bartek1983d';
const count = iconNames.length.toLocaleString('en-US');

type Support = 'tested' | 'supported' | 'limited';
interface Platform {
  name: string;
  icon: IconName;
  how: string;
  entry: string;
  status: Support;
}

const PLATFORMS: Platform[] = [
  { name: 'React 16.8+ (incl. 19)', icon: 'atom', how: 'Native components, tree-shakable, forwardRef', entry: '@iconix/icons/react', status: 'tested' },
  { name: 'Next.js (App Router)', icon: 'web-code', how: 'Works in Server Components without "use client". Pages Router works too. IconProvider needs a client component', entry: '@iconix/icons/react', status: 'tested' },
  { name: 'Vue 3', icon: 'component', how: 'Native components, plugin and provide/inject defaults', entry: '@iconix/icons/vue', status: 'tested' },
  { name: 'Web Component', icon: 'brackets', how: '<iconix-icon> custom element for any page or framework', entry: '@iconix/icons/element', status: 'tested' },
  { name: 'Vanilla JavaScript', icon: 'braces', how: 'toSvg(), createElement(), replace() for [data-icon] tags', entry: '@iconix/icons', status: 'tested' },
  { name: 'Node.js (ESM & CommonJS)', icon: 'server', how: 'Server-side rendering of SVG strings, sprites and data URIs', entry: '@iconix/icons', status: 'tested' },
  { name: 'TypeScript', icon: 'code-slash', how: 'Typed icon names and options with editor autocomplete', entry: 'built-in types', status: 'tested' },
  { name: 'CLI / static SVG files', icon: 'terminal-square', how: 'npx @iconix/icons export → .svg files and sprites', entry: 'npx @iconix/icons', status: 'tested' },
  { name: 'Nuxt 3', icon: 'layers', how: 'Vue components; import them in any .vue file', entry: '@iconix/icons/vue', status: 'supported' },
  { name: 'Vite, Remix, React Router, Gatsby', icon: 'zap', how: 'Standard React or Vue components', entry: '@iconix/icons/react', status: 'supported' },
  { name: 'Svelte / SvelteKit', icon: 'flame', how: '{@html toSvg(…)} or the <iconix-icon> Web Component', entry: '@iconix/icons', status: 'supported' },
  { name: 'Angular', icon: 'shield', how: '<iconix-icon> with CUSTOM_ELEMENTS_SCHEMA', entry: '@iconix/icons/element', status: 'supported' },
  { name: 'Astro', icon: 'rocket', how: 'toSvg() in front matter with set:html, or React/Vue islands', entry: '@iconix/icons', status: 'supported' },
  { name: 'SolidJS, Lit, Alpine, htmx', icon: 'cube', how: 'Web Component or toSvg() strings', entry: '@iconix/icons/element', status: 'supported' },
  { name: 'Plain HTML, WordPress, PHP', icon: 'file-code', how: 'Web Component from a CDN or exported .svg files', entry: 'CDN / .svg', status: 'supported' },
  { name: 'Figma, Illustrator, Inkscape', icon: 'pen-tool', how: 'Copy SVG from this page or import exported files', entry: '.svg', status: 'supported' },
  { name: 'React Native', icon: 'smartphone', how: 'No native component; use exported SVG with react-native-svg', entry: '.svg', status: 'limited' },
  { name: 'HTML e-mails', icon: 'mail', how: 'Many e-mail clients block SVG; use PNG images instead', entry: '—', status: 'limited' },
];

const STATUS: Record<Support, { label: string; hint: string }> = {
  tested: { label: 'Tested', hint: 'Covered by the automated test suite' },
  supported: { label: 'Works', hint: 'Uses one of the standard APIs above' },
  limited: { label: 'Limited', hint: 'Possible with a workaround' },
};

const START: UsageTab[] = [
  {
    id: 'react', label: 'React', lang: 'tsx',
    intro: 'Import each icon as a component. Every option is a prop, and any other <svg> prop (className, onClick, aria-*) is passed through.',
    code: `import { IconHome, IconSettings, IconBell } from '@iconix/icons/react';

export function Toolbar() {
  return (
    <nav className="toolbar">
      <IconHome />  {/* 24px, currentColor */}
      <IconSettings size={20} strokeWidth={1.5} />
      <IconBell color="#dc2626" variant="circle" background="#fee2e2" title="Notifications" />
    </nav>
  );
}`,
  },
  {
    id: 'next', label: 'Next.js', lang: 'tsx',
    intro: 'Icons render on the server in the App Router. Wrap the app in IconProvider (inside a "use client" file) only if you want shared defaults.',
    code: `// app/page.tsx – Server Component
import { IconRocket } from '@iconix/icons/react';

export default function Page() {
  return <h1><IconRocket size="1em" /> Launch</h1>;
}

// app/providers.tsx – optional, for app-wide defaults
'use client';
import { IconProvider } from '@iconix/icons/react';
export function Providers({ children }: { children: React.ReactNode }) {
  return <IconProvider size={20} strokeWidth={1.5}>{children}</IconProvider>;
}`,
  },
  {
    id: 'vue', label: 'Vue / Nuxt', lang: 'vue',
    intro: 'Import the components you need. Use the plugin to set defaults for the whole app.',
    code: `<script setup lang="ts">
import { IconHome, IconCart } from '@iconix/icons/vue';
</script>

<template>
  <IconHome />
  <IconCart :size="32" color="#2563eb" variant="square" background="#dbeafe" />
</template>

// main.ts
import { IconixPlugin } from '@iconix/icons/vue';
createApp(App).use(IconixPlugin, { size: 20 }).mount('#app');`,
  },
  {
    id: 'html', label: 'HTML (no build)', lang: 'html',
    intro: 'Load the Web Component once from a CDN, then use <iconix-icon> tags anywhere. Works in Angular, Svelte and Solid too.',
    code: `<script type="module">
  import { defineIconElement } from 'https://cdn.jsdelivr.net/npm/@iconix/icons/dist/element.js';
  defineIconElement();
</script>

<iconix-icon name="home"></iconix-icon>
<iconix-icon name="cart" size="32" color="#2563eb"></iconix-icon>
<iconix-icon name="loader" spin label="Loading"></iconix-icon>`,
  },
  {
    id: 'js', label: 'JavaScript', lang: 'js',
    intro: 'Get an SVG string or element anywhere: in the browser, in Node.js, in Svelte or Astro.',
    code: `import { toSvg, createElement, replace } from '@iconix/icons';

toSvg('home', { size: 32, color: 'teal' });       // '<svg …>…</svg>'
document.body.append(createElement('star'));      // SVGSVGElement
replace();                                        // swaps <i data-icon="mail"> for SVG`,
  },
  {
    id: 'cli', label: 'CLI', lang: 'bash',
    intro: 'Export ready-made .svg files, for example for a static site, a mobile app or a design tool.',
    code: `npx @iconix/icons search valve
npx @iconix/icons export home cart user --size 32 --color "#2563eb" -o public/icons
npx @iconix/icons export --category electrical -v circle -b "#dbeafe" -o icons
npx @iconix/icons sprite home cart user -o public/sprite.svg`,
  },
];

const OPTIONS: [string, string, string][] = [
  ['size', '24', 'Width and height. A number is px; strings like "1em" or "2rem" also work.'],
  ['color', 'currentColor', 'Stroke color. The default follows the CSS color of the parent.'],
  ['strokeWidth', '2', 'Line thickness in 24×24 grid units.'],
  ['absoluteStrokeWidth', 'false', 'Keeps the same line thickness in px at every size.'],
  ['variant', '"default"', '"circle" or "square" puts the icon inside a frame.'],
  ['background', '—', 'Fill of the circle/square frame (or a rounded tile).'],
  ['rotate', '0', 'Rotation in degrees.'],
  ['flip', '—', '"horizontal", "vertical" or "both".'],
  ['spin / pulse', 'false', 'Animations (import @iconix/icons/css).'],
  ['title', '—', 'Accessible name; without it the icon is aria-hidden.'],
  ['width / height', '—', 'Set the two sides separately.'],
  ['fill, strokeLinecap, strokeLinejoin', 'none, round, round', 'Fine-tuning the drawing.'],
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="wrap header-row">
          <a href="#" className="brand" aria-label="Iconix home">
            <span className="brand-mark"><Icon name="sparkles" size={18} strokeWidth={2} /></span>
            iconix
          </a>
          <nav className="nav">
            <a href="#icons">Icons</a>
            <a href="#usage">Usage</a>
            <a href="#where">Where it works</a>
            <a href="#options">Options</a>
          </nav>
          <div className="header-actions">
            <a className="btn coffee small-btn" href={COFFEE} target="_blank" rel="noreferrer">
              <Icon name="coffee" size={16} /> <span className="coffee-label">Buy me a coffee</span>
            </a>
            <a className="btn ghost small-btn" href={NPM} target="_blank" rel="noreferrer">
              <IconPackage size={16} /> npm
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-dots" aria-hidden />
          <div className="wrap hero-inner">
            <p className="crumbs mono">@iconix/icons · v1.2.0 · MIT</p>
            <h1>{count} icons for React, Vue&nbsp;&amp;&nbsp;the&nbsp;web.</h1>
            <p className="lead">
              Clean, consistent line icons in {categories.length} categories, from everyday UI to industrial automation,
              electrical and electronics. Open any icon to customize it and copy the code for your stack.
            </p>
            <div className="hero-cta">
              <a href="#icons" className="btn primary">Browse icons <IconArrowRight size={16} /></a>
              <a href="#usage" className="btn ghost">Get started</a>
            </div>
            <div className="install">
              <CodeBlock code="npm i @iconix/icons" lang="bash" title="Install" />
            </div>
            <ul className="stats">
              <li><b>{count}</b><span>icons</span></li>
              <li><b>{categories.length}</b><span>categories</span></li>
              <li><b>3</b><span>shapes: plain, circle, square</span></li>
              <li><b>~6 KB</b><span>for your first icon</span></li>
            </ul>
          </div>
        </section>

        <section id="icons" className="section wrap">
          <IconGallery />
        </section>

        <section id="usage" className="section wrap">
          <div className="section-head">
            <p className="eyebrow">Usage</p>
            <h2>Use them in your stack</h2>
            <p className="muted">Install the package once. Then pick the way that fits your project. Every icon page above shows the same examples for that exact icon.</p>
          </div>
          <div className="steps">
            <div className="step">
              <span className="step-n">1</span>
              <div>
                <h3>Install</h3>
                <CodeBlock code={'npm i @iconix/icons\n# or: pnpm add @iconix/icons · yarn add @iconix/icons · bun add @iconix/icons'} lang="bash" title="Terminal" />
                <p className="muted small">Windows PowerShell shows “running scripts is disabled”? Run <code className="mono">npm.cmd i @iconix/icons</code> instead.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-n">2</span>
              <div>
                <h3>Use an icon</h3>
                <UsageTabs tabs={START} />
              </div>
            </div>
          </div>
        </section>

        <section id="where" className="section wrap">
          <div className="section-head">
            <p className="eyebrow">Compatibility</p>
            <h2>Where can I use Iconix?</h2>
            <p className="muted">
              Iconix ships ESM and CommonJS builds with TypeScript types and has no runtime dependencies. React and Vue are optional peer dependencies.
              Entries marked <b>Tested</b> are checked by the automated test suite: unit tests, server rendering, a real Next.js 16 build and Chromium.
            </p>
          </div>
          <ul className="platforms">
            {PLATFORMS.map((p) => (
              <li key={p.name} className="platform">
                <span className="platform-icon"><Icon name={p.icon} size={22} strokeWidth={1.75} /></span>
                <div className="platform-body">
                  <div className="platform-top">
                    <h3>{p.name}</h3>
                    <span className={`status ${p.status}`} title={STATUS[p.status].hint}>
                      {p.status === 'tested' && <IconCheckCircle size={13} />}
                      {STATUS[p.status].label}
                    </span>
                  </div>
                  <p>{p.how}</p>
                  <code className="mono">{p.entry}</code>
                </div>
              </li>
            ))}
          </ul>
          <div className="reqs">
            <div><b>Browsers</b><span>All evergreen browsers (Chrome, Edge, Firefox, Safari)</span></div>
            <div><b>Node.js</b><span>18 or newer</span></div>
            <div><b>React</b><span>16.8 or newer, tested on 19 (optional)</span></div>
            <div><b>Vue</b><span>3.2 or newer (optional)</span></div>
          </div>
        </section>

        <section id="options" className="section wrap">
          <div className="section-head">
            <p className="eyebrow">Customization</p>
            <h2>All options</h2>
            <p className="muted">These are props in React and Vue, attributes on <code className="mono">&lt;iconix-icon&gt;</code> (in kebab-case, for example <code className="mono">stroke-width</code>), options for <code className="mono">toSvg()</code> and flags in the CLI.</p>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Option</th><th>Default</th><th>What it does</th></tr></thead>
              <tbody>
                {OPTIONS.map(([o, d, w]) => (
                  <tr key={o}><td className="mono">{o}</td><td className="mono muted">{d}</td><td>{w}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="support" className="section wrap">
          <div className="support">
            <span className="support-icon"><Icon name="coffee" size={30} strokeWidth={1.75} /></span>
            <div className="support-text">
              <h2>Support Iconix</h2>
              <p className="muted">
                Iconix is free and MIT licensed. If it saves you time, you can buy me a coffee.
                Every coffee goes into new icons, fixes and updates.
              </p>
            </div>
            <a className="btn coffee big" href={COFFEE} target="_blank" rel="noreferrer">
              <Icon name="coffee" size={18} /> Buy me a coffee
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-row">
          <span>iconix · {count} icons · MIT License</span>
          <span className="footer-links">
            <a href={COFFEE} target="_blank" rel="noreferrer">Buy me a coffee</a>
            <a href={NPM} target="_blank" rel="noreferrer">npmjs.com/package/@iconix/icons</a>
          </span>
        </div>
      </footer>
    </>
  );
}
