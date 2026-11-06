'use client';

import { useState } from 'react';
import { CodeBlock } from './CodeBlock';

export interface UsageTab {
  id: string;
  label: string;
  lang: string;
  intro: string;
  code: string;
}

export function UsageTabs({ tabs }: { tabs: UsageTab[] }) {
  const [id, setId] = useState(tabs[0].id);
  const t = tabs.find((x) => x.id === id) ?? tabs[0];
  return (
    <div className="usage-tabs">
      <div className="tabs" role="tablist">
        {tabs.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={x.id === id} className={x.id === id ? 'on' : ''} onClick={() => setId(x.id)}>
            {x.label}
          </button>
        ))}
      </div>
      <p className="where">{t.intro}</p>
      <CodeBlock code={t.code} lang={t.lang} title={t.label} />
    </div>
  );
}
