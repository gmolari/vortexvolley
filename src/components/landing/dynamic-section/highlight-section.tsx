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
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h3 className="text-2xl font-bold">{main.title}</h3>
          {main.description && <div className="mt-2 max-w-lg text-white/80 [&_p]:m-0" dangerouslySetInnerHTML={{ __html: main.description }} />}
        </div>
      </div>
      {rest.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => {
            const imageOnly = item.imageUrl && !item.title;
            const content = (
              <div key={item.id} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                {item.imageUrl && (
                  <div className={imageOnly ? "overflow-hidden bg-muted" : "aspect-video overflow-hidden bg-muted"}>
                    <img src={item.imageUrl} alt={item.title || ""} className="h-full w-full object-cover" />
                  </div>
                )}
                {!imageOnly && (
                  <div className="p-5">
                    {item.title && <h3 className="font-semibold text-foreground">{item.title}</h3>}
                    {item.description && (
                      <div className="mt-2 text-sm text-muted-foreground [&_p]:m-0 [&_a]:text-primary [&_a]:underline" dangerouslySetInnerHTML={{ __html: item.description }} />
                    )}
                  </div>
                )}
              </div>
            );
            if (imageOnly && item.linkUrl) {
              return <a key={item.id} href={item.linkUrl}>{content}</a>;
            }
            return content;
          })}
        </div>
      )}
    </div>
  );
}
