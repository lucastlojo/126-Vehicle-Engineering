import React from 'react';

const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export function ArrowIcon({ diagonal = false }) {
  return diagonal ? <svg {...common} viewBox="0 0 24 24"><path d="M5 19 19 5M8 5h11v11" /></svg>
    : <svg {...common} viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}
export function CheckIcon() { return <svg {...common} viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>; }
export function AlertIcon() { return <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v6m0 4h.01" /></svg>; }
export function CartIcon() { return <svg {...common} viewBox="0 0 24 24"><path d="M3 4h2l2 11h12l2-8H6M9 20h.01M18 20h.01" /></svg>; }
export function MenuIcon() { return <svg {...common} viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>; }
export function CloseIcon() { return <svg {...common} viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" /></svg>; }
export function WrenchIcon() { return <svg {...common} viewBox="0 0 24 24"><path d="M21 7a6 6 0 0 1-8 5.7L6 19.7a2 2 0 0 1-2.8-2.8l7-7A6 6 0 0 1 16 2l-3 3 1 4 4 1 3-3Z" /></svg>; }
export function ShieldIcon() { return <svg {...common} viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5.2 3.2 9 8 11 4.8-2 8-5.8 8-11V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>; }
export function SearchIcon() { return <svg {...common} viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></svg>; }
