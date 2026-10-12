// SleepNest Admin Panel (/admin) — only opens for accounts with the "admin" role.
import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Mail, RefreshCw, Search, Plus, Pencil, Trash2,
  X, ChevronDown, ChevronUp, Eye, EyeOff, Download, ShieldCheck, ShieldOff, Ban, CheckCircle2, ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { formatINR, formatDate, formatAddress, PAYMENT_LABELS } from '../../utils/orderFormat';
import './AdminPage.css';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', Icon: ShoppingBag },
  { id: 'products', label: 'Products', Icon: Package },
  { id: 'customers', label: 'Customers', Icon: Users },
  { id: 'newsletter', label: 'Newsletter', Icon: Mail },
];

const ORDER_STATUSES = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];
const CATEGORIES = [
  { id: 'mattress', label: 'Mattress' },
  { id: 'bedsheets', label: 'Bedsheets' },
  { id: 'protectors', label: 'Protectors' },
  { id: 'comforter', label: 'Comforter' },
  { id: 'pillows', label: 'Pillows' },
];

const statusClass = (s) => `adm-status adm-status-${String(s).toLowerCase().replace(/\s+/g, '-')}`;

export default function AdminPage() {
  const { user, authReady } = useApp();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'dashboard';
  const setTab = (id) => setParams(id === 'dashboard' ? {} : { tab: id });

  if (!authReady) return <div className="adm-page"><p className="sn-state-msg">Loading...</p></div>;

  if (!user) {
    return (
      <div className="adm-page">
        <div className="adm-gate">
          <ShieldCheck size={40} />
          <h1>SleepNest Admin</h1>
          <p>Log in with your admin account to continue.</p>
          <Link to="/account" state={{ from: '/admin' }} className="btn btn-primary">Admin Login</Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="adm-page">
        <div className="adm-gate">
          <ShieldOff size={40} />
          <h1>No admin access</h1>
          <p>You are logged in as {user.email || user.phone}, which is a customer account.</p>
          <Link to="/" className="btn btn-primary">Back to the store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <div className="adm-shell">
        <aside className="adm-sidebar">
          <div className="adm-brand">
            <ShieldCheck size={20} />
            <div>
              <strong>Admin Panel</strong>
              <span>{user.name || user.email}</span>
            </div>
          </div>
          <nav className="adm-nav">
            {TABS.map(({ id, label, Icon }) => (
              <button key={id} className={`adm-nav-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
                <Icon size={18} /> <span>{label}</span>
              </button>
            ))}
          </nav>
          <Link to="/" className="adm-store-link"><ExternalLink size={14} /> View store</Link>
        </aside>

        <main className="adm-main">
          {tab === 'dashboard' && <Dashboard onOpenOrders={() => setTab('orders')} />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'products' && <ProductsTab />}
          {tab === 'customers' && <CustomersTab currentUserId={user.id} />}
          {tab === 'newsletter' && <NewsletterTab />}
        </main>
      </div>
    </div>
  );
}

// ── Shared bits ────────────────────────────────────────────────

function useLoader(loader, deps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);
  const loaderRef = useRef(loader);
  const key = JSON.stringify(deps);

  useEffect(() => { loaderRef.current = loader; });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    loaderRef.current()
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [key, tick]);

  return { data, setData, loading, error, reload: () => setTick((t) => t + 1) };
}

function Header({ title, subtitle, onRefresh, children }) {
  return (
    <div className="adm-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="adm-header-actions">
        {children}
        {onRefresh && (
          <button className="adm-btn adm-btn-ghost" onClick={onRefresh} title="Refresh"><RefreshCw size={16} /></button>
        )}
      </div>
    </div>
  );
}

function StateRow({ loading, error, empty, colSpan, emptyText }) {
  if (loading) return <tr><td colSpan={colSpan} className="adm-empty">Loading...</td></tr>;
  if (error) return <tr><td colSpan={colSpan} className="adm-empty adm-error">{error}</td></tr>;
  if (empty) return <tr><td colSpan={colSpan} className="adm-empty">{emptyText}</td></tr>;
  return null;
}

// ── Dashboard ──────────────────────────────────────────────────

function Dashboard({ onOpenOrders }) {
  const { data, loading, error, reload } = useLoader(() => api.admin.stats(), []);
  const s = data?.stats;

  const cards = s
    ? [
        { label: 'Revenue (excl. cancelled)', value: `₹${formatINR(s.revenue)}`, sub: `₹${formatINR(s.todayRevenue)} today` },
        { label: 'Orders', value: s.totalOrders, sub: `${s.todayOrders} today` },
        { label: 'To fulfil', value: s.pendingOrders, sub: 'Confirmed, shipped or out for delivery', accent: true },
        { label: 'Customers', value: s.customers, sub: 'registered accounts' },
        { label: 'Products live', value: s.products, sub: s.hiddenProducts ? `${s.hiddenProducts} hidden` : 'all visible' },
        { label: 'Subscribers', value: s.subscribers, sub: 'newsletter' },
      ]
    : [];

  return (
    <>
      <Header title="Dashboard" subtitle="Live numbers from your MongoDB database" onRefresh={reload} />
      {error && <p className="sn-form-error">{error}</p>}
      <div className="adm-cards">
        {loading && !s
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="adm-card adm-card-skeleton" />)
          : cards.map((c) => (
              <div key={c.label} className={`adm-card ${c.accent ? 'adm-card-accent' : ''}`}>
                <span className="adm-card-label">{c.label}</span>
                <strong className="adm-card-value">{c.value}</strong>
                <span className="adm-card-sub">{c.sub}</span>
              </div>
            ))}
      </div>

      {s && (
        <div className="adm-status-strip">
          {ORDER_STATUSES.map((st) => (
            <div key={st} className="adm-status-cell">
              <span className={statusClass(st)}>{st}</span>
              <strong>{s.byStatus[st] || 0}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2>Latest orders</h2>
          <button className="adm-link" onClick={onOpenOrders}>Manage orders →</button>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Order</th><th>Date</th><th>Customer</th><th className="num">Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              <StateRow loading={loading && !data} error={error} empty={data && !data.recentOrders.length} colSpan={5} emptyText="No orders yet." />
              {data?.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="mono">{o.orderNumber}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>{o.user?.name || o.shippingAddress?.name}<div className="adm-muted">{o.user?.email || o.user?.phone}</div></td>
                  <td className="num">₹{formatINR(o.total)}</td>
                  <td><span className={statusClass(o.status)}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Orders ─────────────────────────────────────────────────────

const ORDER_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'out-for-delivery', label: 'Out for delivery' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

function OrdersTab() {
  const { showToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const { data, setData, loading, error, reload } = useLoader(
    () => api.admin.orders({ status: filter === 'all' ? undefined : filter, search: query || undefined, limit: 200 }),
    [filter, query]
  );
  const orders = data?.orders || [];

  const replaceOrder = (order) => setData((d) => ({ ...d, orders: d.orders.map((o) => (o.id === order.id ? { ...o, ...order, user: o.user } : o)) }));

  const update = async (order, payload, message) => {
    setBusyId(order.id);
    try {
      const res = await api.admin.updateOrder(order.orderNumber, payload);
      replaceOrder(res.order);
      showToast(message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (order) => {
    if (!window.confirm(`Delete order ${order.orderNumber} permanently? This cannot be undone.`)) return;
    setBusyId(order.id);
    try {
      await api.admin.deleteOrder(order.orderNumber);
      setData((d) => ({ ...d, orders: d.orders.filter((o) => o.id !== order.id), total: d.total - 1 }));
      showToast('Order deleted', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <Header title="Orders" subtitle={data ? `${data.total} order${data.total === 1 ? '' : 's'}` : ' '} onRefresh={reload}>
        <form className="adm-search" onSubmit={(e) => { e.preventDefault(); setQuery(search.trim()); }}>
          <Search size={15} />
          <input placeholder="Order number, e.g. SN1234567" value={search} onChange={(e) => { setSearch(e.target.value); if (!e.target.value) setQuery(''); }} />
        </form>
      </Header>

      <div className="adm-pills">
        {ORDER_FILTERS.map((f) => (
          <button key={f.id} className={`adm-pill ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      <div className="adm-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order</th><th>Date</th><th>Customer</th><th className="num">Items</th><th className="num">Total</th>
                <th>Payment</th><th>Status</th><th />
              </tr>
            </thead>
            <tbody>
              <StateRow loading={loading} error={error} empty={!orders.length} colSpan={8} emptyText="No orders match this filter." />
              {!loading && orders.map((o) => {
                const open = openId === o.id;
                const busy = busyId === o.id;
                return [
                  <tr key={o.id} className={open ? 'is-open' : ''}>
                    <td className="mono">{o.orderNumber}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{o.user?.name || o.shippingAddress?.name}<div className="adm-muted">{o.user?.email || o.user?.phone || o.shippingAddress?.phone}</div></td>
                    <td className="num">{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                    <td className="num">₹{formatINR(o.total)}</td>
                    <td>
                      <div className="adm-muted">{PAYMENT_LABELS[o.paymentMethod] || o.paymentMethod}</div>
                      <select className="adm-select adm-select-sm" value={o.paymentStatus} disabled={busy}
                        onChange={(e) => update(o, { paymentStatus: e.target.value }, `Payment marked ${e.target.value}`)}>
                        {PAYMENT_STATUSES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className={`adm-select ${statusClass(o.status)}`} value={o.status} disabled={busy}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (o.status === 'Cancelled' && !window.confirm(`Order ${o.orderNumber} was cancelled. Re-open it as "${next}"?`)) return;
                          if (next === 'Cancelled' && !window.confirm(`Cancel order ${o.orderNumber}?`)) return;
                          update(o, { status: next }, `Order ${o.orderNumber} → ${next}`);
                        }}>
                        {ORDER_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </td>
                    <td className="adm-row-actions">
                      <button className="adm-icon-btn" onClick={() => setOpenId(open ? null : o.id)} title="Details">{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                      <button className="adm-icon-btn danger" onClick={() => remove(o)} disabled={busy} title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>,
                  open && (
                    <tr key={`${o.id}-detail`} className="adm-detail-row">
                      <td colSpan={8}>
                        <div className="adm-order-detail">
                          <div>
                            <h4>Items</h4>
                            {o.items.map((i) => (
                              <div key={`${i.productId}-${i.selectedSize}`} className="adm-order-item">
                                {i.image && <img src={i.image} alt="" />}
                                <div>
                                  <strong>{i.name}</strong>
                                  <div className="adm-muted">{i.selectedSize} · Qty {i.qty} · ₹{formatINR(i.price)} each</div>
                                </div>
                                <span className="num">₹{formatINR(i.price * i.qty)}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <h4>Deliver to</h4>
                            <p><strong>{o.shippingAddress.name}</strong> · +91 {o.shippingAddress.phone}</p>
                            <p className="adm-muted">{formatAddress(o.shippingAddress)}</p>
                            <h4>Amounts</h4>
                            <p className="adm-amounts">
                              <span>Subtotal ₹{formatINR(o.subtotal)}</span>
                              <span>Discount −₹{formatINR(o.discount)}</span>
                              <span>GST ₹{formatINR(o.gst)}</span>
                              <strong>Total ₹{formatINR(o.total)}</strong>
                            </p>
                            <h4>History</h4>
                            <p className="adm-muted">
                              {o.statusHistory.map((h) => `${h.status} (${formatDate(h.at, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })})`).join(' → ')}
                            </p>
                            {o.cancelReason && <p className="adm-muted">Cancel reason: {o.cancelReason}</p>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ),
                ];
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Products ───────────────────────────────────────────────────

const EMPTY_PRODUCT = {
  id: '', name: '', category: 'mattress', subcategory: '', description: '', price: '', originalPrice: '',
  rating: '', badge: '', sizes: '', images: '', features: '', warranty: '', inStock: true, isActive: true,
};

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const lines = (s) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

function toForm(p) {
  return {
    ...EMPTY_PRODUCT,
    ...p,
    price: p.price ?? '',
    originalPrice: p.originalPrice ?? '',
    rating: p.rating ?? '',
    sizes: (p.sizes || []).join(', '),
    images: (p.images || []).join('\n'),
    features: (p.features || []).join('\n'),
    description: p.description || '',
    warranty: p.warranty || '',
    badge: p.badge || '',
    subcategory: p.subcategory || '',
  };
}

function ProductsTab() {
  const { showToast } = useApp();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | product id
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const { data, setData, loading, error, reload } = useLoader(() => api.admin.products(), []);

  const products = (data?.products || []).filter((p) =>
    (category === 'all' || p.category === category) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search.toLowerCase()))
  );

  const openNew = () => { setForm(EMPTY_PRODUCT); setFormError(''); setEditing('new'); };
  const openEdit = (p) => { setForm(toForm(p)); setFormError(''); setEditing(p.id); };
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const save = async (e) => {
    e.preventDefault();
    const price = Number(form.price);
    const mrp = form.originalPrice === '' ? undefined : Number(form.originalPrice);
    const id = editing === 'new' ? slugify(form.id || form.name) : editing;
    if (form.name.trim().length < 2) return setFormError('Product name is required');
    if (!id) return setFormError('Product ID is required');
    if (!(price >= 0) || form.price === '') return setFormError('Enter a valid selling price');
    if (mrp !== undefined && !(mrp >= price)) return setFormError('MRP should be equal to or higher than the selling price');
    if (form.rating !== '' && !(Number(form.rating) >= 0 && Number(form.rating) <= 5)) return setFormError('Rating must be between 0 and 5');
    if (!lines(form.images).length) return setFormError('Add at least one image URL');

    const payload = {
      name: form.name.trim(),
      category: form.category,
      subcategory: form.subcategory.trim(),
      description: form.description.trim(),
      price,
      ...(mrp !== undefined ? { originalPrice: mrp, discount: mrp > 0 ? Math.round((1 - price / mrp) * 100) : 0 } : {}),
      ...(form.rating !== '' ? { rating: Number(form.rating) } : {}),
      badge: form.badge.trim(),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: lines(form.images),
      features: lines(form.features),
      warranty: form.warranty.trim() || undefined,
      inStock: !!form.inStock,
      isActive: !!form.isActive,
    };

    setSaving(true);
    setFormError('');
    try {
      if (editing === 'new') {
        const res = await api.admin.createProduct({ id, ...payload });
        setData((d) => ({ ...d, products: [...d.products, res.product] }));
        showToast('Product added', 'success');
      } else {
        const res = await api.admin.updateProduct(editing, payload);
        setData((d) => ({ ...d, products: d.products.map((p) => (p.id === editing ? res.product : p)) }));
        showToast('Product updated', 'success');
      }
      setEditing(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const quickToggle = async (p, field) => {
    setBusyId(p.id);
    try {
      const res = await api.admin.updateProduct(p.id, { [field]: !p[field] });
      setData((d) => ({ ...d, products: d.products.map((x) => (x.id === p.id ? res.product : x)) }));
      const msg = field === 'inStock' ? (res.product.inStock ? 'Marked in stock' : 'Marked out of stock') : (res.product.isActive ? 'Product visible on site' : 'Product hidden from site');
      showToast(msg, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}" permanently?\n\nTip: use the eye button to hide it instead, so it can be restored later.`)) return;
    setBusyId(p.id);
    try {
      await api.admin.deleteProduct(p.id);
      setData((d) => ({ ...d, products: d.products.filter((x) => x.id !== p.id) }));
      showToast('Product deleted', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const thumb = (p) => p.images?.find((i) => !i.endsWith('.mp4')) || '';

  return (
    <>
      <Header title="Products" subtitle={data ? `${data.products.length} in catalogue` : ' '} onRefresh={reload}>
        <div className="adm-search">
          <Search size={15} />
          <input placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="adm-btn adm-btn-primary" onClick={openNew}><Plus size={16} /> Add product</button>
      </Header>

      <div className="adm-pills">
        <button className={`adm-pill ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`adm-pill ${category === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>{c.label}</button>
        ))}
      </div>

      <div className="adm-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Product</th><th>Category</th><th className="num">Price</th><th className="num">MRP</th><th>Stock</th><th>On site</th><th /></tr>
            </thead>
            <tbody>
              <StateRow loading={loading} error={error} empty={!products.length} colSpan={7} emptyText="No products found." />
              {!loading && products.map((p) => {
                const busy = busyId === p.id;
                return (
                  <tr key={p.id} className={p.isActive === false ? 'is-hidden' : ''}>
                    <td>
                      <div className="adm-product-cell">
                        {thumb(p) ? <img src={thumb(p)} alt="" /> : <div className="adm-thumb-empty" />}
                        <div>
                          <strong>{p.name}</strong>
                          <div className="adm-muted mono">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{CATEGORIES.find((c) => c.id === p.category)?.label || p.category}<div className="adm-muted">{p.subcategory}</div></td>
                    <td className="num">₹{formatINR(p.price)}</td>
                    <td className="num adm-muted">{p.originalPrice ? `₹${formatINR(p.originalPrice)}` : '—'}</td>
                    <td>
                      <button className={`adm-toggle ${p.inStock ? 'on' : ''}`} onClick={() => quickToggle(p, 'inStock')} disabled={busy}>
                        {p.inStock ? 'In stock' : 'Out of stock'}
                      </button>
                    </td>
                    <td>
                      <button className="adm-icon-btn" onClick={() => quickToggle(p, 'isActive')} disabled={busy} title={p.isActive === false ? 'Hidden — click to show' : 'Visible — click to hide'}>
                        {p.isActive === false ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </td>
                    <td className="adm-row-actions">
                      <button className="adm-icon-btn" onClick={() => openEdit(p)} title="Edit"><Pencil size={16} /></button>
                      <button className="adm-icon-btn danger" onClick={() => remove(p)} disabled={busy} title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="adm-modal-overlay" onClick={() => !saving && setEditing(null)}>
          <form className="adm-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className="adm-modal-head">
              <h2>{editing === 'new' ? 'Add product' : 'Edit product'}</h2>
              <button type="button" className="adm-icon-btn" onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-grid-2">
                <label className="adm-field adm-span-2">
                  <span>Product name *</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, ...(editing === 'new' && !form.idTouched ? { id: slugify(e.target.value) } : {}) })} />
                </label>
                <label className="adm-field adm-span-2">
                  <span>Product ID (used in the page link) {editing !== 'new' && '— cannot be changed'}</span>
                  <input value={editing === 'new' ? form.id : editing} disabled={editing !== 'new'} onChange={(e) => setForm({ ...form, id: slugify(e.target.value), idTouched: true })} />
                  <small>/product/{editing === 'new' ? form.id || 'your-product-id' : editing}</small>
                </label>
                <label className="adm-field">
                  <span>Category *</span>
                  <select value={form.category} onChange={set('category')}>
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </label>
                <label className="adm-field">
                  <span>Sub-category</span>
                  <input value={form.subcategory} onChange={set('subcategory')} placeholder="e.g. Memory Foam" />
                </label>
                <label className="adm-field">
                  <span>Selling price (₹) *</span>
                  <input type="number" min="0" value={form.price} onChange={set('price')} />
                </label>
                <label className="adm-field">
                  <span>MRP (₹)</span>
                  <input type="number" min="0" value={form.originalPrice} onChange={set('originalPrice')} />
                  {Number(form.originalPrice) > 0 && Number(form.price) >= 0 && form.price !== '' && (
                    <small>{Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)}% off</small>
                  )}
                </label>
                <label className="adm-field">
                  <span>Rating (0–5)</span>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set('rating')} />
                </label>
                <label className="adm-field">
                  <span>Badge</span>
                  <input value={form.badge} onChange={set('badge')} placeholder="e.g. Best Seller" />
                </label>
                <label className="adm-field adm-span-2">
                  <span>Sizes (comma separated)</span>
                  <input value={form.sizes} onChange={set('sizes')} placeholder="Single, Double, Queen, King" />
                </label>
                <label className="adm-field adm-span-2">
                  <span>Image / video URLs * (one per line — first image is the main one)</span>
                  <textarea rows={4} value={form.images} onChange={set('images')} placeholder="/images/generated/sleepnest_mattress_card.jpg" />
                </label>
                <label className="adm-field adm-span-2">
                  <span>Key features (one per line)</span>
                  <textarea rows={3} value={form.features} onChange={set('features')} />
                </label>
                <label className="adm-field adm-span-2">
                  <span>Description</span>
                  <textarea rows={3} value={form.description} onChange={set('description')} />
                </label>
                <label className="adm-field">
                  <span>Warranty</span>
                  <input value={form.warranty} onChange={set('warranty')} placeholder="e.g. 10 Years" />
                </label>
                <div className="adm-field adm-checks">
                  <label><input type="checkbox" checked={form.inStock} onChange={set('inStock')} /> In stock</label>
                  <label><input type="checkbox" checked={form.isActive} onChange={set('isActive')} /> Show on website</label>
                </div>
              </div>
              {formError && <p className="sn-form-error">{formError}</p>}
            </div>
            <div className="adm-modal-foot">
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>{saving ? 'Saving...' : editing === 'new' ? 'Add product' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

// ── Customers ──────────────────────────────────────────────────

function CustomersTab({ currentUserId }) {
  const { showToast } = useApp();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState(null);
  const { data, setData, loading, error, reload } = useLoader(() => api.admin.users({ search: query || undefined, limit: 200 }), [query]);
  const users = data?.users || [];

  const patch = async (u, payload, message) => {
    setBusyId(u.id);
    try {
      const res = await api.admin.updateUser(u.id, payload);
      setData((d) => ({ ...d, users: d.users.map((x) => (x.id === u.id ? res.user : x)) }));
      showToast(message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete the account of ${u.name || u.email || u.phone}? Their orders are kept.`)) return;
    setBusyId(u.id);
    try {
      await api.admin.deleteUser(u.id);
      setData((d) => ({ ...d, users: d.users.filter((x) => x.id !== u.id), total: d.total - 1 }));
      showToast('Account deleted', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <Header title="Customers" subtitle={data ? `${data.total} account${data.total === 1 ? '' : 's'}` : ' '} onRefresh={reload}>
        <form className="adm-search" onSubmit={(e) => { e.preventDefault(); setQuery(search.trim()); }}>
          <Search size={15} />
          <input placeholder="Name, email or phone" value={search} onChange={(e) => { setSearch(e.target.value); if (!e.target.value) setQuery(''); }} />
        </form>
      </Header>
      <div className="adm-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Last login</th><th>Role</th><th /></tr>
            </thead>
            <tbody>
              <StateRow loading={loading} error={error} empty={!users.length} colSpan={7} emptyText="No accounts found." />
              {!loading && users.map((u) => {
                const self = u.id === currentUserId;
                const busy = busyId === u.id;
                return (
                  <tr key={u.id} className={u.isActive === false ? 'is-hidden' : ''}>
                    <td><strong>{u.name || '—'}</strong>{self && <span className="adm-chip">You</span>}{u.isActive === false && <span className="adm-chip adm-chip-red">Disabled</span>}</td>
                    <td>{u.email || '—'}</td>
                    <td>{u.phone ? `+91 ${u.phone}` : '—'}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td className="adm-muted">{u.lastLoginAt ? formatDate(u.lastLoginAt) : '—'}</td>
                    <td><span className={`adm-role ${u.role}`}>{u.role}</span></td>
                    <td className="adm-row-actions">
                      {!self && (
                        <>
                          <button className="adm-icon-btn" disabled={busy} title={u.role === 'admin' ? 'Remove admin access' : 'Make admin'}
                            onClick={() => {
                              const toAdmin = u.role !== 'admin';
                              if (toAdmin && !window.confirm(`Give ${u.name || u.email} full admin access?`)) return;
                              patch(u, { role: toAdmin ? 'admin' : 'customer' }, toAdmin ? 'Admin access given' : 'Admin access removed');
                            }}>
                            {u.role === 'admin' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                          </button>
                          <button className="adm-icon-btn" disabled={busy} title={u.isActive === false ? 'Enable account' : 'Disable account'}
                            onClick={() => patch(u, { isActive: u.isActive === false }, u.isActive === false ? 'Account enabled' : 'Account disabled')}>
                            {u.isActive === false ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                          </button>
                          <button className="adm-icon-btn danger" disabled={busy} onClick={() => remove(u)} title="Delete account"><Trash2 size={16} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Newsletter ─────────────────────────────────────────────────

function NewsletterTab() {
  const { showToast } = useApp();
  const { data, setData, loading, error, reload } = useLoader(() => api.admin.subscribers(), []);
  const subs = data?.subscribers || [];

  const exportCsv = () => {
    const rows = [['email', 'subscribed_on', 'status'], ...subs.map((s) => [s.email, new Date(s.createdAt).toISOString().slice(0, 10), s.isActive ? 'active' : 'unsubscribed'])];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sleepnest-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const remove = async (s) => {
    if (!window.confirm(`Remove ${s.email} from the list?`)) return;
    try {
      await api.admin.deleteSubscriber(s.id);
      setData((d) => ({ ...d, subscribers: d.subscribers.filter((x) => x.id !== s.id) }));
      showToast('Subscriber removed', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <>
      <Header title="Newsletter" subtitle={data ? `${subs.filter((s) => s.isActive).length} active subscriber${subs.length === 1 ? '' : 's'}` : ' '} onRefresh={reload}>
        <button className="adm-btn adm-btn-ghost" onClick={exportCsv} disabled={!subs.length}><Download size={16} /> Export CSV</button>
      </Header>
      <div className="adm-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Email</th><th>Subscribed</th><th>Status</th><th /></tr></thead>
            <tbody>
              <StateRow loading={loading} error={error} empty={!subs.length} colSpan={4} emptyText="No subscribers yet." />
              {!loading && subs.map((s) => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td>{formatDate(s.createdAt)}</td>
                  <td>{s.isActive ? <span className="adm-status adm-status-delivered">Active</span> : <span className="adm-status adm-status-cancelled">Unsubscribed</span>}</td>
                  <td className="adm-row-actions"><button className="adm-icon-btn danger" onClick={() => remove(s)} title="Remove"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
