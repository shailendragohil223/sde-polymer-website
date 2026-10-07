import React, { useState, useEffect } from 'react';
import { 
  X, RefreshCw, Plus, Trash2, CheckCircle2, MessageSquare, 
  FileText, Package, Database, ShieldCheck 
} from 'lucide-react';
import { 
  getAdminStats, getQuoteRequests, updateQuoteStatus, 
  getContactInquiries, updateInquiryStatus, getProducts, 
  getCategories, createProduct, deleteProduct 
} from '../services/api';

export default function AdminDashboardModal({ isOpen, onClose, onToast, onRefreshCatalog }) {
  const [activeTab, setActiveTab] = useState('quotes');
  const [stats, setStats] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // New product form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    category_id: '',
    subtitle: '',
    short_desc: '',
    full_desc: '',
    material_grades: '',
    shore_hardness: '',
    temp_rating: '',
    applications: '',
    features: '',
    is_featured: false
  });

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, quotesRes, inqRes, prodsRes, catsRes] = await Promise.all([
        getAdminStats(),
        getQuoteRequests(),
        getContactInquiries(),
        getProducts(),
        getCategories()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (quotesRes.success) setQuotes(quotesRes.data);
      if (inqRes.success) setInquiries(inqRes.data);
      if (prodsRes.success) setProducts(prodsRes.data);
      if (catsRes.success) {
        setCategories(catsRes.data);
        if (catsRes.data.length > 0 && !newProd.category_id) {
          setNewProd(prev => ({ ...prev, category_id: catsRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      if (onToast) onToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateQuoteStatus(id, status);
      if (res.success) {
        setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
        if (onToast) onToast('Quote status updated!', 'success');
      }
    } catch (err) {
      if (onToast) onToast('Failed to update quote status', 'error');
    }
  };

  const handleInquiryStatusChange = async (id, status) => {
    try {
      const res = await updateInquiryStatus(id, status);
      if (res.success) {
        setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
        if (onToast) onToast('Inquiry status updated!', 'success');
      }
    } catch (err) {
      if (onToast) onToast('Failed to update inquiry status', 'error');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name) {
      if (onToast) onToast('Product name is required', 'error');
      return;
    }

    try {
      const res = await createProduct(newProd);
      if (res.success) {
        if (onToast) onToast('Product created successfully!', 'success');
        setShowAddForm(false);
        setNewProd({
          name: '',
          category_id: categories[0]?.id || '',
          subtitle: '',
          short_desc: '',
          full_desc: '',
          material_grades: '',
          shore_hardness: '',
          temp_rating: '',
          applications: '',
          features: '',
          is_featured: false
        });
        fetchAdminData();
        if (onRefreshCatalog) onRefreshCatalog();
      }
    } catch (err) {
      if (onToast) onToast('Failed to add product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
        if (onToast) onToast('Product deleted!', 'success');
        if (onRefreshCatalog) onRefreshCatalog();
      }
    } catch (err) {
      if (onToast) onToast('Failed to delete product', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow" style={{ marginBottom: '4px', fontSize: '11px' }}>
              MANAGEMENT CONSOLE
            </span>
            <h2 style={{ fontSize: '24px', color: 'var(--navy-deep)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Admin Dashboard &amp; CMS
              <span className="mono" style={{ fontSize: '12px', background: 'var(--accent-glow)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '4px' }}>
                <Database size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Engine: {stats?.dbMode || 'Live MySQL'}
              </span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              className="btn btn-outline-navy btn-sm" 
              onClick={fetchAdminData}
              title="Refresh data"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>
            <button className="modal-close" onClick={onClose} aria-label="Close admin modal">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        {stats && (
          <div className="admin-kpi-grid">
            <div className="admin-kpi-card">
              <div className="num">{stats.totalQuotes}</div>
              <div className="lbl">Total RFQ Quotes ({stats.pendingQuotes} Pending)</div>
            </div>
            <div className="admin-kpi-card">
              <div className="num">{stats.totalInquiries}</div>
              <div className="lbl">Contact Messages ({stats.newInquiries} New)</div>
            </div>
            <div className="admin-kpi-card">
              <div className="num">{stats.totalProducts}</div>
              <div className="lbl">Active Products in Catalog</div>
            </div>
            <div className="admin-kpi-card">
              <div className="num">{stats.totalCategories}</div>
              <div className="lbl">Polymer Categories</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button 
            className={`admin-tab-btn ${activeTab === 'quotes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quotes')}
          >
            <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} />
            RFQ Quote Inquiries ({quotes.length})
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <MessageSquare size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Contact Messages ({inquiries.length})
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Product Catalog ({products.length})
          </button>
        </div>

        {/* Tab 1: RFQ Quotes */}
        {activeTab === 'quotes' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client &amp; Company</th>
                  <th>Phone / Email</th>
                  <th>Material &amp; Hardness</th>
                  <th>Qty / Specs</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {quotes.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--steel)' }}>
                      No quote inquiries submitted yet. Submit a test quote from the front website!
                    </td>
                  </tr>
                ) : (
                  quotes.map(q => (
                    <tr key={q.id}>
                      <td className="mono" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {new Date(q.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td>
                        <strong>{q.name}</strong>
                        {q.company && <div style={{ fontSize: '12px', color: 'var(--steel)' }}>{q.company}</div>}
                      </td>
                      <td>
                        <div>{q.phone}</div>
                        <div style={{ fontSize: '12px', color: 'var(--steel)' }}>{q.email}</div>
                      </td>
                      <td>
                        <div>{q.material || 'Standard Polymer'}</div>
                        <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)' }}>{q.shore_hardness}</div>
                      </td>
                      <td>
                        <div>Qty: <strong>{q.quantity || '1'}</strong></div>
                        {q.drawing_notes && <div style={{ fontSize: '12px', color: 'var(--steel)', maxWidth: '200px' }}>{q.drawing_notes}</div>}
                      </td>
                      <td>
                        <select 
                          value={q.status} 
                          onChange={(e) => handleStatusChange(q.id, e.target.value)}
                          className={`status-badge status-${q.status}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_review">In Review</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Contact Inquiries */}
        {activeTab === 'inquiries' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--steel)' }}>
                      No direct contact messages received yet.
                    </td>
                  </tr>
                ) : (
                  inquiries.map(inq => (
                    <tr key={inq.id}>
                      <td className="mono" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {new Date(inq.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td>
                        <strong>{inq.name}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--steel)' }}>{inq.email} | {inq.phone}</div>
                      </td>
                      <td>{inq.subject || 'General Inquiry'}</td>
                      <td style={{ maxWidth: '280px', fontSize: '13px', lineHeight: 1.4 }}>{inq.message}</td>
                      <td>
                        <select 
                          value={inq.status} 
                          onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                          className={`status-badge status-${inq.status}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Products CRUD */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '16px' }}>Catalog Items ({products.length})</h4>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus size={14} /> {showAddForm ? 'Cancel' : 'Add New Product'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddProduct} style={{ background: 'var(--paper)', padding: '20px', borderRadius: '4px', marginBottom: '20px', border: '1px solid var(--line-dark)' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '15px' }}>Add New Engineered Polymer Product</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. PU Scraper Blades" 
                      value={newProd.name} 
                      onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      className="form-select" 
                      value={newProd.category_id} 
                      onChange={(e) => setNewProd({ ...newProd, category_id: e.target.value })}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.code}: {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Shore Hardness</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 70A–95A Shore" 
                      value={newProd.shore_hardness} 
                      onChange={(e) => setNewProd({ ...newProd, shore_hardness: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Temperature Rating</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. -40°C to +150°C" 
                      value={newProd.temp_rating} 
                      onChange={(e) => setNewProd({ ...newProd, temp_rating: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Material Grades</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Polyurethane TDI, NBR 70, Viton FKM" 
                    value={newProd.material_grades} 
                    onChange={(e) => setNewProd({ ...newProd, material_grades: e.target.value })} 
                  />
                </div>

                <div className="form-group">
                  <label>Short Description</label>
                  <textarea 
                    rows="2" 
                    className="form-textarea" 
                    placeholder="Summary for product cards..." 
                    value={newProd.short_desc} 
                    onChange={(e) => setNewProd({ ...newProd, short_desc: e.target.value })} 
                  ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input 
                      type="checkbox" 
                      checked={newProd.is_featured} 
                      onChange={(e) => setNewProd({ ...newProd, is_featured: e.target.checked })} 
                    />
                    Feature this product on homepage
                  </label>
                  <button type="submit" className="btn btn-secondary btn-sm">
                    Save Product to MySQL
                  </button>
                </div>
              </form>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Shore Hardness</th>
                    <th>Temp Rating</th>
                    <th>Featured</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.category_name || p.category_code || 'General'}</td>
                      <td className="mono">{p.shore_hardness || '—'}</td>
                      <td className="mono">{p.temp_rating || '—'}</td>
                      <td>{p.is_featured ? '⭐ Yes' : 'No'}</td>
                      <td>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
