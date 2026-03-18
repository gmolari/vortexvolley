import type { LandingItem } from "@/types";

interface HighlightSectionProps {
  items: LandingItem[];
}

export function HighlightSection({ items }: HighlightSectionProps) {
  const [main, ...rest] = items;
  if (!main) return null;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-muted aspect-[21/9]">
        {main.imageUrl && (
          <img src={main.imageUrl} alt={main.title} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h3 className="text-2xl font-bold">{main.title}</h3>
          {main.description && <p className="mt-2 max-w-lg text-white/80">{main.description}</p>}
        </div>
      </div>
      {rest.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/50 bg-card p-5">
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              {item.description && (
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
