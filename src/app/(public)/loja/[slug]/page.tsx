import { notFound } from "next/navigation";
import { getSaleItemBySlug } from "@/lib/services/sale-item.service";
import { OrderForm } from "./order-form";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getSaleItemBySlug(slug);
  if (!item) return { title: "Item não encontrado" };
  return {
    title: item.name,
    description: item.description.slice(0, 160),
  };
}

export default async function ItemDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getSaleItemBySlug(slug);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-muted">
            {item.images[0] ? (
              <img
                src={item.images[0].url}
                alt={item.images[0].alt || item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl font-bold text-muted-foreground/20">
                V
              </div>
            )}
          </div>
          {item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {item.images.slice(1).map((img) => (
                <div key={img.id} className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img src={img.url} alt={img.alt || ""} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info + Form */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{item.name}</h1>
          <p className="mt-4 text-2xl font-bold text-primary">
            R$ {Number(item.price).toFixed(2).replace(".", ",")}
          </p>
          {item.estimatedDelivery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Entrega estimada: {item.estimatedDelivery}
            </p>
          )}
          <p className="mt-6 text-muted-foreground leading-relaxed">{item.description}</p>

          <div className="mt-10">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Solicitar Item</h2>
            <OrderForm
              saleItemId={item.id}
              fields={item.fields.map((f) => ({
                ...f,
                options: f.options || [],
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
