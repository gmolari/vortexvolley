import type { LandingItem } from "@/types";

interface BannerSectionProps {
  items: LandingItem[];
}

export function BannerSection({ items }: BannerSectionProps) {
  const item = items[0];
  if (!item) return null;

  return (
    <div
      className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-muted"
      style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white p-8">
        <h3 className="text-3xl font-bold">{item.title}</h3>
        {item.description && <p className="mt-3 max-w-xl mx-auto text-white/80">{item.description}</p>}
        {item.linkUrl && (
          <a
            href={item.linkUrl}
            className="mt-6 inline-flex rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Saiba mais
          </a>
        )}
      </div>
    </div>
  );
}
