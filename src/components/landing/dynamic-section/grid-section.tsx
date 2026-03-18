import Link from "next/link";
import type { LandingItem } from "@/types";

interface GridSectionProps {
  items: LandingItem[];
}

export function GridSection({ items }: GridSectionProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Wrapper = item.linkUrl ? Link : "div";
        const wrapperProps = item.linkUrl ? { href: item.linkUrl } : {};
        return (
          <Wrapper
            key={item.id}
            {...(wrapperProps as any)}
            className="group rounded-xl border border-border/50 bg-card overflow-hidden transition-all hover:shadow-md hover:border-primary/30"
          >
            {item.imageUrl && (
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5">
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              {item.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{item.description}</p>
              )}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
