import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getActiveSaleItems } from "@/lib/services/sale-item.service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loja",
  description: "Confira os itens disponíveis do Vortex Londrina.",
};

export const dynamic = "force-dynamic";

export default async function LojaPage() {
  const items = await getActiveSaleItems().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Nossa Loja</h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
        <p className="mt-4 text-muted-foreground">Solicite seus itens sob demanda</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <h2 className="text-xl font-semibold text-foreground">Nenhum item disponível</h2>
          <p className="mt-2 text-muted-foreground">Volte em breve para novidades!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/loja/${item.slug}`}
              className="group rounded-xl border border-border/50 bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
            >
              <div className="aspect-square bg-muted relative overflow-hidden">
                {item.images[0] ? (
                  <img
                    src={item.images[0].url}
                    alt={item.images[0].alt || item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                <p className="mt-3 text-xl font-bold text-primary">
                  R$ {Number(item.price).toFixed(2).replace(".", ",")}
                </p>
                {item.estimatedDelivery && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Entrega estimada: {item.estimatedDelivery}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
