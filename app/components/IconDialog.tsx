'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toSvg, type IconName } from '@iconix/icons';
import {
  Icon, IconChevronLeft, IconChevronRight, IconClose, IconDownload, IconRefresh,
} from '@iconix/icons/react';
import { CodeBlock, CopyButton } from './CodeBlock';
import { AnimationDemo } from './AnimationDemo';
import { DEFAULTS, pascal, snippets, toOptions, type Custom } from '../lib/snippets';

const COLORS = ['currentColor', '#0f172a', '#2563eb', '#0891b2', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#db2777'];
const BACKGROUNDS = ['', '#eff6ff', '#ecfdf5', '#fef3c7', '#fee2e2', '#f3e8ff', '#0f172a'];
const SIZES = [16, 20, 24, 32, 48, 64];

interface Props {
  name: IconName;
  category: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function IconDialog({ name, category, onClose, onPrev, onNext }: Props) {
  const [c, setC] = useState<Custom>(DEFAULTS);
  const [tab, setTab] = useState('react');
  const panelRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof Custom>(k: K, v: Custom[K]) => setC((p) => ({ ...p, [k]: v }));

  const svg = useMemo(() => toSvg(name, toOptions(c)), [name, c]);
  const list = useMemo(() => snippets(name, c, svg), [name, c, svg]);
  const active = list.find((s) => s.id === tab) ?? list[0];
  const changed = JSON.stringify(c) !== JSON.stringify(DEFAULTS);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.('input, select, textarea');
      if (e.key === 'Escape') onClose();
      else if (!typing && e.key === 'ArrowLeft') onPrev();
      else if (!typing && e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const download = () => {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const opts = toOptions(c);
  const previewColor = c.color === 'currentColor' ? undefined : c.color;

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title" ref={panelRef} tabIndex={-1}>
        <header className="dlg-head">
          <div>
            <h2 id="dlg-title" className="mono">{name}</h2>
            <p className="muted small">
              <span className="pill">{category.replace(/-/g, " ")}</span>
              <span className="mono">Icon{pascal(name)}</span>
            </p>
          </div>
          <div className="dlg-nav">
            <button type="button" className="icon-btn" onClick={onPrev} aria-label="Previous icon"><IconChevronLeft size={18} /></button>
            <button type="button" className="icon-btn" onClick={onNext} aria-label="Next icon"><IconChevronRight size={18} /></button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><IconClose size={18} /></button>
          </div>
        </header>

        <div className="dlg-body">
          {/* ---------- Preview + customizer ---------- */}
          <section className="customizer" aria-label="Customize">
            <div className="preview">
              <div className="preview-stage" style={{ color: previewColor }}>
                <Icon name={name} {...opts} size={Math.min(160, Math.max(56, c.size * 2.5))} />
              </div>
              <div className="preview-sizes" style={{ color: previewColor }}>
                {SIZES.map((s) => (
                  <div key={s} className="preview-size">
                    <Icon name={name} {...opts} size={s} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <div className="preview-inline">
                <button type="button" className="demo-btn" tabIndex={-1}>
                  <Icon name={name} {...opts} size="1.15em" />
                  Button
                </button>
                <span className="demo-text" style={{ color: previewColor }}>
                  <Icon name={name} {...opts} size="1em" /> Inline with text
                </span>
              </div>
            </div>

            <div className="controls">
              <div className="control">
                <label>Color</label>
                <div className="swatches">
                  {COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      className={`swatch${c.color === col ? ' on' : ''}${col === 'currentColor' ? ' inherit' : ''}`}
                      style={col === 'currentColor' ? undefined : { background: col }}
                      onClick={() => set('color', col)}
                      aria-label={col === 'currentColor' ? 'Inherit (currentColor)' : col}
                      title={col === 'currentColor' ? 'currentColor (inherits text color)' : col}
                    />
                  ))}
                  <input
                    type="color"
                    aria-label="Custom color"
                    value={c.color.startsWith('#') ? c.color : '#2563eb'}
                    onChange={(e) => set('color', e.target.value)}
                  />
                  <code className="mono small">{c.color}</code>
                </div>
              </div>

              <div className="control">
                <label htmlFor="ctl-size">Size <b>{c.size}px</b></label>
                <input id="ctl-size" type="range" min={12} max={96} step={1} value={c.size}
                  onChange={(e) => set('size', Number(e.target.value))} />
              </div>

              <div className="control">
                <label htmlFor="ctl-stroke">Stroke width <b>{c.strokeWidth}</b></label>
                <input id="ctl-stroke" type="range" min={0.5} max={3} step={0.25} value={c.strokeWidth}
                  onChange={(e) => set('strokeWidth', Number(e.target.value))} />
                <label className="check">
                  <input type="checkbox" checked={c.absoluteStrokeWidth}
                    onChange={(e) => set('absoluteStrokeWidth', e.target.checked)} />
                  Keep stroke width constant at every size
                </label>
              </div>

              <div className="control">
                <label>Shape</label>
                <div className="segmented">
                  {(['default', 'circle', 'square'] as const).map((v) => (
                    <button key={v} type="button" className={c.variant === v ? 'on' : ''} onClick={() => set('variant', v)}>
                      {v === 'default' ? 'None' : v === 'circle' ? 'Circle' : 'Square'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control">
                <label>Background</label>
                <div className="swatches">
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg || 'none'}
                      type="button"
                      className={`swatch${c.background === bg ? ' on' : ''}${bg ? '' : ' none'}`}
                      style={bg ? { background: bg } : undefined}
                      onClick={() => set('background', bg)}
                      aria-label={bg || 'No background'}
                      title={bg || 'none'}
                    />
                  ))}
                  <input
                    type="color"
                    aria-label="Custom background"
                    value={c.background || '#eff6ff'}
                    onChange={(e) => set('background', e.target.value)}
                  />
                </div>
              </div>

              <div className="control two">
                <div>
                  <label>Rotate</label>
                  <div className="segmented">
                    {[0, 90, 180, 270].map((r) => (
                      <button key={r} type="button" className={c.rotate === r ? 'on' : ''} onClick={() => set('rotate', r)}>{r}°</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label>Flip</label>
                  <div className="segmented">
                    {([['', 'None'], ['horizontal', '↔'], ['vertical', '↕'], ['both', 'Both']] as const).map(([v, l]) => (
                      <button key={l} type="button" className={c.flip === v ? 'on' : ''} onClick={() => set('flip', v)}
                        aria-label={v ? `Flip ${v}` : 'No flip'}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="actions">
                <button type="button" className="btn" onClick={download}><IconDownload size={16} /> Download SVG</button>
                <CopyButton text={svg} label="Copy SVG" />
                <CopyButton text={`Icon${pascal(name)}`} label="Copy name" />
                <button type="button" className="btn ghost" onClick={() => setC(DEFAULTS)} disabled={!changed}>
                  <IconRefresh size={16} /> Reset
                </button>
              </div>
            </div>
          </section>

          {/* ---------- Where & how to use it ---------- */}
          <section className="usage" aria-label="How to use this icon">
            <h3>Where can I use it?</h3>
            <div className="tabs" role="tablist">
              {list.map((s) => (
                <button key={s.id} type="button" role="tab" aria-selected={s.id === active.id}
                  className={s.id === active.id ? 'on' : ''} onClick={() => setTab(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
            <p className="where">{active.where}</p>
            <CodeBlock code={active.code} lang={active.lang} title={active.label} />
            {active.id !== 'svg' && active.id !== 'cli' && active.id !== 'html' && (
              <p className="muted small">Install once: <code className="mono">npm i @iconix/icons</code></p>
            )}
            {changed && (
              <p className="muted small">The example includes your customization. Only options that differ from the defaults are listed.</p>
            )}
            <AnimationDemo
              name={name}
              options={opts}
              framework={tab === 'vue' || tab === 'html' || tab === 'js' ? tab : 'react'}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
