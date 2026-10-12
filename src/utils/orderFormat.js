// Helpers that turn API order data into the text the existing order screens display
export const PAYMENT_LABELS = {
  upi: 'UPI',
  card: 'Credit / Debit Card',
  netbanking: 'Net Banking',
  cod: 'Cash On Delivery',
  emi: 'EMI / Pay Later',
};

export const formatINR = (n) => Number(n || 0).toLocaleString('en-IN');

export function formatDate(value, opts = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', opts);
}

export const shortDate = (value) => formatDate(value, { month: 'short', day: '2-digit' });

// Maps order status to the label + pill class used in AccountPage.css
export function statusPill(status) {
  if (status === 'Delivered') return { label: 'Delivered', className: 'delivered' };
  if (status === 'Cancelled') return { label: 'Cancelled', className: 'cancelled' };
  return { label: 'In progress', className: 'in-progress' };
}

export function orderSummaryText(order) {
  const names = order.items.map((i) => i.name);
  if (names.length <= 3) return names.join(' | ');
  return `${names.slice(0, 3).join(' | ')} & ${names.length - 3} more items`;
}

export function formatAddress(a) {
  if (!a) return '';
  return [a.flatNo, a.floor && `Floor ${a.floor}`, a.building, a.address, a.landmark, a.city, a.state]
    .filter(Boolean)
    .join(', ') + (a.pincode ? ` - ${a.pincode}` : '');
}
