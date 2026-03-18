"use client";

import { use } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { Tabs, TabsList, TabsTrigger, TabsContent, Spinner, Button } from "@/components/ui";
import { useSaleItemById } from "@/lib/hooks";
import { InfoTab } from "./components/info-tab";
import { ImagesTab } from "./components/images-tab";
import { FieldsTab } from "./components/fields-tab";
import { OrdersTab } from "./components/orders-tab";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditItemPage({ params }: Props) {
  const { id } = use(params);
  const { data: item, isLoading } = useSaleItemById(id);

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Carregando..." />
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <AdminHeader title="Item não encontrado" />
        <div className="p-6 text-center text-muted-foreground">Item não encontrado.</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={item.name} />
      <div className="p-6">
        <div className="mb-4 flex justify-end">
          <Link href={`/admin/itens/${id}/preview`} target="_blank">
            <Button variant="outline"><Eye className="mr-2 h-4 w-4" /> Preview</Button>
          </Link>
        </div>
        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="images">Imagens ({item.images?.length || 0})</TabsTrigger>
            <TabsTrigger value="fields">Campos ({item.fields?.length || 0})</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
          </TabsList>

          <TabsContent value="info"><InfoTab item={item} /></TabsContent>
          <TabsContent value="images"><ImagesTab item={item} /></TabsContent>
          <TabsContent value="fields"><FieldsTab item={item} /></TabsContent>
          <TabsContent value="orders"><OrdersTab saleItemId={item.id} /></TabsContent>
        </Tabs>
      </div>
    </>
  );
}
