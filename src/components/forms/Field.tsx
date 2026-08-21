import type { ReactNode } from 'react';
import { Icon } from '@/components/primitives/Icon';

export function Field({ label, htmlFor, required, error, hint, children }: {
  label: string; htmlFor?: string; required?: boolean;
  error?: string; hint?: string; children: ReactNode;
}) {
  return (
    <div className={`field${error ? ' bad' : ''}`}>
      <label htmlFor={htmlFor}>{label}{required && <span className="req">*</span>}</label>
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="err"><Icon n="info" s={14} />{error}</span>}
    </div>
  );
}
