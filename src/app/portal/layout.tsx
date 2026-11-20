import { PortalNav } from "@/components/PortalNav";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell flex h-[100dvh] flex-col bg-cream">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <PortalNav />
    </div>
  );
}
