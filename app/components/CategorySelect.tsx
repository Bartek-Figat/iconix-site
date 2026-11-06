'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { IconCategory } from '@iconix/icons';
import { IconCheck, IconChevronDown, IconSearch } from '@iconix/icons/react';

const label = (c: string) => c.replace(/-/g, ' ');

interface Props {
  value: '' | IconCategory;
  categories: readonly IconCategory[];
  counts: Map<string, number>;
  total: number;
  onChange: (v: '' | IconCategory) => void;
}

export function CategorySelect({ value, categories, counts, total, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const options = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const all: { value: '' | IconCategory; text: string; count: number }[] = [
      { value: '', text: `All ${categories.length} categories`, count: total },
      ...categories.map((c) => ({ value: c, text: label(c), count: counts.get(c) ?? 0 })),
    ];
    return q ? all.filter((o) => o.value && o.text.includes(q)) : all;
  }, [filter, categories, counts, total]);

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    requestAnimationFrame(() => filterRef.current?.focus());
    return () => document.removeEventListener('mousedown', onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const choose = (v: '' | IconCategory) => {
    onChange(v);
    setOpen(false);
    setFilter('');
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(options.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); const o = options[active]; if (o) choose(o.value); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); }
  };

  return (
    <div className="cat-select" ref={root}>
      <button
        type="button"
        className="cat-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="eyebrow">Category</span>
        <span className={value ? "cat-value cap" : "cat-value"}>{value ? label(value) : `All ${categories.length} categories`}</span>
        <span className="cat-count mono">{value ? counts.get(value) : total}</span>
        <IconChevronDown size={16} className={open ? 'cat-chev open' : 'cat-chev'} aria-hidden />
      </button>

      {open && (
        <div className="cat-pop" onKeyDown={onKey}>
          <label className="cat-filter">
            <IconSearch size={15} aria-hidden />
            <input
              ref={filterRef}
              id={`${id}-filter`}
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setActive(0); }}
              placeholder="Find a category"
              aria-label="Find a category"
              autoComplete="off"
            />
          </label>
          <ul className="cat-list" role="listbox" id={id} ref={list} aria-label="Categories">
            {options.map((o, i) => (
              <li
                key={o.value || 'all'}
                role="option"
                aria-selected={o.value === value}
                data-i={i}
                className={`${i === active ? 'active' : ''}${o.value === value ? ' selected' : ''}${o.value === '' ? ' all' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(o.value)}
              >
                <span className="cat-check">{o.value === value && <IconCheck size={14} />}</span>
                <span className="cat-name">{o.text}</span>
                <span className="cat-n mono">{o.count}</span>
              </li>
            ))}
            {!options.length && <li className="cat-empty">No category matches “{filter}”.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
