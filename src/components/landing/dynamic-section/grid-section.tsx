import Link from "next/link";
import type { LandingItem, SectionConfig } from "@/types";

interface GridSectionProps {
  items: LandingItem[];
  config?: SectionConfig | null;
}

const colsClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
};

export function GridSection({ items, config }: GridSectionProps) {
  const columns = config?.columns || 3;
  const gridClass = colsClass[columns] || colsClass[3];

  return (
    <div className={`grid gap-6 ${gridClass}`}>
      {items.map((item) => {
        const imageOnly = item.imageUrl && !item.title;
        const Wrapper = item.linkUrl ? Link : "div";
        const wrapperProps = item.linkUrl ? { href: item.linkUrl } : {};
        return (
          <Wrapper
            key={item.id}
            {...(wrapperProps as any)}
            className="group rounded-xl border border-border/50 bg-card overflow-hidden transition-all hover:shadow-md hover:border-primary/30"
          >
            {item.imageUrl && (
              <div className={imageOnly ? "overflow-hidden bg-muted" : "aspect-video overflow-hidden bg-muted"}>
                <img
                  src={item.imageUrl}
                  alt={item.title || ""}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            {!imageOnly && (
              <div className="p-5">
                {item.title && <h3 className="font-semibold text-foreground">{item.title}</h3>}
                {item.description && (
                  <div
                    className="mt-2 text-sm text-muted-foreground [&_strong]:font-semibold [&_em]:italic [&_a]:text-primary [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
            )}
          </Wrapper>
        );
      })}
    </div>
  );
}
