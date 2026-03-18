import nodemailer from "nodemailer";

interface OrderInfo {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
}

interface ItemInfo {
  name: string;
  price: string;
}

interface FieldInfo {
  id: string;
  label: string;
}

export async function sendOrderNotification(
  order: OrderInfo,
  item: ItemInfo,
  values: Record<string, string>,
  fields: FieldInfo[],
  toEmail: string
) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log("[Email] SMTP não configurado. Pedido registrado sem envio de email.");
    console.log(`[Email] Pedido ${order.id} para ${toEmail}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port) || 587,
    secure: Number(port) === 465,
    auth: { user, pass },
  });

  const fieldMap = new Map(fields.map((f) => [f.id, f.label]));
  const fieldRows = Object.entries(values)
    .map(([fieldId, value]) => {
      const label = fieldMap.get(fieldId) || fieldId;
      return `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:600">${label}</td><td style="padding:8px;border:1px solid #ddd">${value}</td></tr>`;
    })
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1e40af;color:#fff;padding:20px;text-align:center">
        <h1 style="margin:0">VORTEX VOLLEY</h1>
        <p style="margin:5px 0 0;opacity:0.8">Nova Solicitação de Pedido</p>
      </div>
      <div style="padding:20px;background:#f9f9f9">
        <h2 style="color:#1e40af">Pedido #${order.id.slice(0, 8)}</h2>
        <p><strong>Item:</strong> ${item.name}</p>
        <p><strong>Valor:</strong> R$ ${Number(item.price).toFixed(2)}</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:20px 0">
        <h3 style="color:#1e40af">Dados do Solicitante</h3>
        <p><strong>Nome:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        ${order.customerPhone ? `<p><strong>Telefone:</strong> ${order.customerPhone}</p>` : ""}
        ${order.notes ? `<p><strong>Observações:</strong> ${order.notes}</p>` : ""}
        ${fieldRows ? `<h3 style="color:#1e40af">Detalhes do Pedido</h3><table style="width:100%;border-collapse:collapse">${fieldRows}</table>` : ""}
      </div>
      <div style="padding:15px;text-align:center;color:#666;font-size:12px">
        Vortex Londrina &mdash; Voleibol Amador
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Vortex Volley" <${user}>`,
    to: toEmail,
    subject: `Novo Pedido: ${item.name} - ${order.customerName}`,
    html,
  });
}
