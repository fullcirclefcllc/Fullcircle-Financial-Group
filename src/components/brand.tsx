import type { SVGProps } from "react";

export function Orbit({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 420 420" className={className}>
      <circle cx="210" cy="210" r="180" fill="none" stroke="#C9A646" strokeWidth="1.5" />
      <ellipse cx="210" cy="210" rx="200" ry="70" fill="none" stroke="#C9A646" strokeWidth="1" transform="rotate(-25 210 210)" />
      <circle cx="372" cy="150" r="6" fill="#C9A646" />
    </svg>
  );
}

export function Wordmark({ light = true }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg aria-hidden="true" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15" fill="none" stroke="#C9A646" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="7" fill="none" stroke={light ? "#F5EFE0" : "#0A1F44"} strokeWidth="1.5" />
      </svg>
      <div className={`font-brand text-[15px] font-bold leading-tight tracking-[0.12em] ${light ? "text-cream" : "text-navy"}`}>
        FULL CIRCLE
        <br />
        <span className={`text-[11px] font-medium tracking-[0.3em] ${light ? "text-gold" : "text-muted"}`}>FORMATIONS</span>
      </div>
    </div>
  );
}

export function GuideAvatar() {
  return (
    <div aria-hidden="true" className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-navy">
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7.5" fill="none" stroke="#C9A646" strokeWidth="2" />
        <circle cx="10" cy="10" r="2.5" fill="#F5EFE0" />
      </svg>
    </div>
  );
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 22): SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
});

export const Icon = {
  Chevron: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><path d="M9 6l6 6-6 6" /></svg>,
  Back: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><path d="M15 6l-6 6 6 6" /></svg>,
  Check: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><path d="M5 12.5l4.5 4.5L19 7" /></svg>,
  Lock: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
  Send: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  Mic: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>,
  Chart: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><path d="M4 19V10M10 19V5M16 19v-6M22 19H2" /></svg>,
  Shield: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /></svg>,
  Clock: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>,
  Home: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><path d="M3 11l9-7 9 7v9H3z" /></svg>,
  Doc: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><path d="M6 3h9l4 4v14H6z" /></svg>,
  Guide: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg>,
  User: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></svg>,
  Plus: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>,
  Trash: ({ size, ...p }: IconProps) => <svg {...base(size)} {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>,
};
