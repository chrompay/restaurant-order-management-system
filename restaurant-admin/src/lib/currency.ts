const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}
