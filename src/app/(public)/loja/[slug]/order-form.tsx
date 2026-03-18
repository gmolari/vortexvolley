"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Button, Input, Textarea, FormField, Spinner } from "@/components/ui";
import { useCreateOrder } from "@/lib/hooks";

interface FieldOption {
  id: string;
  label: string;
  value: string;
}

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string | null;
  options: FieldOption[];
}

interface OrderFormProps {
  saleItemId: string;
  fields: Field[];
}

export function OrderForm({ saleItemId, fields }: OrderFormProps) {
  const [success, setSuccess] = useState(false);
  const createOrder = useCreateOrder();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    const { customerName, customerEmail, customerPhone, notes, ...fieldValues } = data;
    try {
      await createOrder.mutateAsync({
        saleItemId,
        customerName,
        customerEmail,
        customerPhone: customerPhone || undefined,
        notes: notes || undefined,
        values: fieldValues,
      });
      setSuccess(true);
      toast.success("Solicitação enviada com sucesso!");
    } catch {
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-success" />
        <h3 className="mt-4 text-xl font-semibold text-foreground">Solicitação Enviada!</h3>
        <p className="mt-2 text-muted-foreground">
          Recebemos seu pedido. Entraremos em contato em breve pelo email informado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Seus Dados</h3>

        <FormField label="Nome completo" required error={errors.customerName?.message as string}>
          <Input
            {...register("customerName", { required: "Nome obrigatório" })}
            placeholder="Seu nome completo"
          />
        </FormField>

        <FormField label="Email" required error={errors.customerEmail?.message as string}>
          <Input
            type="email"
            {...register("customerEmail", { required: "Email obrigatório" })}
            placeholder="seu@email.com"
          />
        </FormField>

        <FormField label="Telefone" error={errors.customerPhone?.message as string}>
          <Input {...register("customerPhone")} placeholder="(00) 00000-0000" />
        </FormField>
      </div>

      {fields.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Detalhes do Pedido</h3>

          {fields.map((field) => (
            <FormField
              key={field.id}
              label={field.label}
              required={field.required}
              error={errors[field.id]?.message as string}
            >
              {field.type === "TEXTAREA" ? (
                <Textarea
                  {...register(field.id, {
                    required: field.required ? `${field.label} é obrigatório` : false,
                  })}
                  placeholder={field.placeholder || ""}
                />
              ) : field.type === "SELECT" || field.type === "SIZE" ? (
                <select
                  {...register(field.id, {
                    required: field.required ? `${field.label} é obrigatório` : false,
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Selecione...</option>
                  {field.options.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "CHECKBOX" ? (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register(field.id)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">{field.placeholder || field.label}</span>
                </label>
              ) : (
                <Input
                  type={field.type === "NUMBER" ? "number" : field.type === "EMAIL" ? "email" : field.type === "PHONE" ? "tel" : "text"}
                  {...register(field.id, {
                    required: field.required ? `${field.label} é obrigatório` : false,
                  })}
                  placeholder={field.placeholder || ""}
                />
              )}
            </FormField>
          ))}
        </div>
      )}

      <FormField label="Observações">
        <Textarea {...register("notes")} placeholder="Alguma observação adicional?" rows={3} />
      </FormField>

      <Button
        type="submit"
        disabled={createOrder.isPending}
        className="w-full"
      >
        {createOrder.isPending ? (
          <span className="flex items-center gap-2"><Spinner size="sm" /> Enviando...</span>
        ) : (
          "Enviar Solicitação"
        )}
      </Button>
    </form>
  );
}
