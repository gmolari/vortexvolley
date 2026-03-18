import { notFound } from "next/navigation";
import { getSaleItemBySlug } from "@/lib/services/sale-item.service";
import { OrderForm } from "./order-form";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
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
    description: item.description.replace(/<[^>]*>/g, "").slice(0, 160),
  };
}

const statusConfig: Record<string, { label: string; class: string }> = {
  ACTIVE: { label: "Disponível", class: "bg-success/10 text-success border-success/20" },
  EXPIRED: { label: "Expirado", class: "bg-destructive/10 text-destructive border-destructive/20" },
  NEAR: { label: "Em breve", class: "bg-primary/10 text-primary border-primary/20" },
};

function formatDate(date: string | Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function ItemDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getSaleItemBySlug(slug) as any;
  if (!item) notFound();

  const status = item.status || "ACTIVE";
  const canOrder = status === "ACTIVE";
  const sc = statusConfig[status] || statusConfig.ACTIVE;
  const startsAt = formatDate(item.startsAt);
  const expiresAt = formatDate(item.expiresAt);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-muted relative">
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
              {item.images.slice(1).map((img: any) => (
                <div key={img.id} className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img src={img.url} alt={img.alt || ""} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info + Form */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${sc.class}`}>
              {sc.label}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-foreground">{item.name}</h1>
          <p className={`mt-4 text-2xl font-bold ${status === "EXPIRED" ? "text-muted-foreground line-through" : "text-primary"}`}>
            R$ {Number(item.price).toFixed(2).replace(".", ",")}
          </p>

          {(startsAt || expiresAt) && (
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {startsAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Início: {startsAt}
                </span>
              )}
              {expiresAt && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Até: {expiresAt}
                </span>
              )}
            </div>
          )}

          {item.estimatedDelivery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Entrega estimada: {item.estimatedDelivery}
            </p>
          )}

          <div
            className="mt-6 text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_a]:text-primary"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />

          {canOrder ? (
            <div className="mt-10">
              <h2 className="mb-6 text-xl font-semibold text-foreground">Solicitar Item</h2>
              <OrderForm
                saleItemId={item.id}
                fields={item.fields.map((f: any) => ({
                  ...f,
                  options: f.options || [],
                }))}
              />
            </div>
          ) : (
            <div className="mt-10 rounded-xl border border-border bg-muted/50 p-6 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-warning mb-3" />
              <h3 className="font-semibold text-foreground">
                {status === "EXPIRED" ? "Item expirado" : "Item em breve disponível"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {status === "EXPIRED"
                  ? "Este item não está mais disponível para solicitação."
                  : "Este item estará disponível em breve. Volte mais tarde!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
