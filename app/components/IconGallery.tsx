'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { categories, iconNames, icons, searchIcons, type IconCategory, type IconName } from '@iconix/icons';
import { Icon, IconSearch } from '@iconix/icons/react';
import { IconDialog } from './IconDialog';
import { CategorySelect } from './CategorySelect';

const label = (c: string) => c.replace(/-/g, ' ');

export function IconGallery() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'' | IconCategory>('');
  const [open, setOpen] = useState<IconName | null>(null);
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const n of iconNames) m.set(icons[n].category, (m.get(icons[n].category) ?? 0) + 1);
    return m;
  }, []);

  const results = useMemo<IconName[]>(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (q) return searchIcons(q, { category: category || undefined, limit: 5000 }).map((i) => i.name);
    return category ? iconNames.filter((n) => icons[n].category === category) : [...iconNames];
  }, [deferredQuery, category]);

  // "/" focuses the search, like on most docs sites.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target as HTMLElement).closest('input, textarea, select') && !open) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Deep link: #icon=home opens that icon.
  useEffect(() => {
    const fromHash = () => {
      const m = /icon=([a-z0-9-]+)/.exec(location.hash);
      if (m && m[1] in icons) setOpen(m[1] as IconName);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const show = useCallback((n: IconName | null) => {
    setOpen(n);
    try { history.replaceState(null, '', n ? `#icon=${n}` : location.pathname + location.search); } catch { /* sandboxed */ }
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    if (!open || !results.length) return;
    const i = results.indexOf(open);
    show(results[(i + dir + results.length) % results.length]);
  }, [open, results, show]);

  const onPrev = useCallback(() => step(-1), [step]);
  const onNext = useCallback(() => step(1), [step]);
  const onClose = useCallback(() => show(null), [show]);

  return (
    <div className="gallery">
      <div className="toolbar">
        <label className="search">
          <IconSearch size={18} aria-hidden />
          <input
            ref={inputRef}
            type="search"
            placeholder={`Search ${iconNames.length.toLocaleString('en-US')} icons`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search icons"
          />
          <kbd>/</kbd>
        </label>
        <CategorySelect
          value={category}
          categories={categories}
          counts={counts}
          total={iconNames.length}
          onChange={setCategory}
        />
      </div>

      <div className="chips" role="group" aria-label="Quick category filter">
        <button type="button" className={category === '' ? 'on' : ''} onClick={() => setCategory('')}>All</button>
        {categories.map((c) => (
          <button key={c} type="button" className={category === c ? 'on' : ''} onClick={() => setCategory(c)}>
            {label(c)}
          </button>
        ))}
      </div>

      <p className="result-count mono">
        {results.length.toLocaleString('en-US')} icons · {category ? label(category) : 'every category'}
        {deferredQuery && <> · “{deferredQuery}”</>}
      </p>

      {results.length ? (
        <ul className="grid">
          {results.map((n) => (
            <li key={n}>
              <button type="button" className="cell" onClick={() => show(n)} title={n}>
                <Icon name={n} size={26} strokeWidth={1.75} aria-hidden />
                <span className="cell-name">{n}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p>No icons match “{query}”.</p>
          <button type="button" className="btn ghost" onClick={() => { setQuery(''); setCategory(''); }}>Clear filters</button>
        </div>
      )}

      {open && (
        <IconDialog
          name={open}
          category={icons[open].category}
          onClose={onClose}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </div>
  );
}
