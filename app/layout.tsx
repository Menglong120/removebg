import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Remove BG',
  description: 'Remove image backgrounds with a modern Next.js + shadcn-style interface.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
