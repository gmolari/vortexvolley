import type { LandingItem } from "@/types";

interface TextSectionProps {
  items: LandingItem[];
}

export function TextSection({ items }: TextSectionProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {items.map((item) => (
        <div key={item.id} className="text-center">
          <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
          {item.description && (
            <p className="mt-3 text-muted-foreground leading-relaxed">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
