import * as React from 'react';
import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950/80 shadow-soft backdrop-blur',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-2 p-6', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-2xl font-semibold text-slate-50', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-slate-400', className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-t border-slate-800/80 p-6', className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
