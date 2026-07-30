import { format } from "date-fns";
import type { Order } from "../types/order.types";
import { formatOrderId, getCustomerName } from "./orderDisplay";
import { formatCurrency } from "@/lib/currency";

export function printOrderReceipt(order: Order) {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td>${item.quantity}x ${item.foodName}</td>
          <td style="text-align:right">${formatCurrency(item.priceAtPurchase * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt ${formatOrderId(order._id)}</title>
        <style>
          body { font-family: monospace; padding: 24px; max-width: 320px; margin: 0 auto; }
          h1 { font-size: 16px; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          td { padding: 4px 0; font-size: 13px; }
          .total td { border-top: 1px dashed #000; font-weight: bold; padding-top: 8px; }
        </style>
      </head>
      <body>
        <h1>Order ${formatOrderId(order._id)}</h1>
        <p>${getCustomerName(order)}</p>
        <p>${format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}</p>
        <table>
          ${itemsHtml}
          <tr class="total"><td>Total</td><td style="text-align:right">${formatCurrency(order.totalAmount)}</td></tr>
        </table>
      </body>
    </html>`;

  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (!printWindow) return;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
