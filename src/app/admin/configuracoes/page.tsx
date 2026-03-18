"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/layout";
import { Button, Input, FormField, Spinner, Card, CardContent } from "@/components/ui";
import { useGlobalEmail, useSetGlobalEmail } from "@/lib/hooks";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const { data: email, isLoading } = useGlobalEmail();
  const setGlobalEmail = useSetGlobalEmail();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (email) setValue(email);
  }, [email]);

  const handleSave = async () => {
    try {
      await setGlobalEmail.mutateAsync(value);
      toast.success("Email atualizado");
    } catch {
      toast.error("Erro ao salvar");
    }
  };

  return (
    <>
      <AdminHeader title="Configurações" />
      <div className="p-6 max-w-2xl">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Notificações</h2>
            <p className="text-sm text-muted-foreground">
              Email padrão para receber notificações de novos pedidos. Pode ser sobrescrito por item.
            </p>
            <FormField label="Email Global de Notificação">
              <div className="flex gap-3">
                <Input
                  type="email"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="contato@vortexvolley.com"
                  className="flex-1"
                />
                <Button onClick={handleSave} disabled={setGlobalEmail.isPending || isLoading}>
                  {setGlobalEmail.isPending ? <Spinner size="sm" /> : "Salvar"}
                </Button>
              </div>
            </FormField>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
