import type { Metadata } from 'next';
import { categories, iconNames } from '@iconix/icons';
import './globals.css';

export const metadata: Metadata = {
  title: 'Iconix – SVG icons for React, Vue and the web',
  description: `${iconNames.length.toLocaleString('en-US')} consistent SVG line icons in ${categories.length} categories. Browse, customize and copy them for React, Next.js, Vue, HTML and more.`,
};

// Runs before the first paint so the saved theme never flashes. Light is the default.
const themeScript = `try{var t=localStorage.getItem('iconix-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
