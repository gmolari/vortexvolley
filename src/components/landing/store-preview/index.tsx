import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "../section-wrapper";

interface StoreItem {
  name: string;
  slug: string;
  price: string;
  images: { url: string; alt: string | null }[];
}

interface StorePreviewProps {
  items: StoreItem[];
}

export function StorePreview({ items }: StorePreviewProps) {
  if (items.length === 0) return null;

  const displayItems = items.slice(0, 4);

  return (
    <SectionWrapper id="loja-preview" title="Nossa Loja">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayItems.map((item) => (
          <Link
            key={item.slug}
            href={`/loja/${item.slug}`}
            className="group rounded-xl border border-border/50 bg-card overflow-hidden transition-all hover:shadow-md hover:border-primary/30"
          >
            <div className="aspect-square bg-muted relative overflow-hidden">
              {item.images[0] ? (
                <img
                  src={item.images[0].url}
                  alt={item.images[0].alt || item.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground/20">
                  V
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <p className="mt-1 text-lg font-bold text-primary">
                R$ {Number(item.price).toFixed(2).replace('.', ',')}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/loja"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Ver todos os itens
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </SectionWrapper>
  );
}
