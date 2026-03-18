import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, AlertTriangle } from "lucide-react";
import { getSaleItemById } from "@/lib/services/sale-item.service";
import { OrderForm } from "@/app/(public)/loja/[slug]/order-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

const statusConfig: Record<string, { label: string; class: string }> = {
  ACTIVE: { label: "Disponível", class: "bg-success/10 text-success border-success/20" },
  EXPIRED: { label: "Expirado", class: "bg-destructive/10 text-destructive border-destructive/20" },
  NEAR: { label: "Em breve", class: "bg-primary/10 text-primary border-primary/20" },
  INACTIVE: { label: "Inativo", class: "bg-muted text-muted-foreground border-border" },
  DRAFT: { label: "Rascunho", class: "bg-muted text-muted-foreground border-border" },
};

function formatDate(date: string | Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function PreviewItemPage({ params }: Props) {
  const { id } = await params;
  const item = await getSaleItemById(id) as any;
  if (!item) notFound();

  const status = item.status || "ACTIVE";
  const sc = statusConfig[status] || statusConfig.ACTIVE;
  const startsAt = formatDate(item.startsAt);
  const expiresAt = formatDate(item.expiresAt);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-warning bg-warning/10 p-3 text-center text-sm text-warning font-medium">
        Modo Preview — Esta visualização simula a página pública do item
      </div>
      <div className="p-4">
        <Link href={`/admin/itens/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Admin
        </Link>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-muted relative">
              {item.images?.[0] ? (
                <img src={item.images[0].url} alt={item.images[0].alt || item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl font-bold text-muted-foreground/20">V</div>
              )}
            </div>
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.slice(1).map((img: any) => (
                  <div key={img.id} className="aspect-square overflow-hidden rounded-lg bg-muted">
                    <img src={img.url} alt={img.alt || ""} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

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
                {startsAt && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Início: {startsAt}</span>}
                {expiresAt && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Até: {expiresAt}</span>}
              </div>
            )}

            {item.estimatedDelivery && (
              <p className="mt-2 text-sm text-muted-foreground">Entrega estimada: {item.estimatedDelivery}</p>
            )}

            <div
              className="mt-6 text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_a]:text-primary"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />

            <div className="mt-10">
              <h2 className="mb-6 text-xl font-semibold text-foreground">Solicitar Item</h2>
              <OrderForm
                saleItemId={item.id}
                fields={(item.fields || []).map((f: any) => ({
                  ...f,
                  options: f.options || [],
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
