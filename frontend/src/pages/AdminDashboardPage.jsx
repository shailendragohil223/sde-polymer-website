import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Database, RefreshCw, Plus, Trash2, LogOut, ExternalLink, 
  FileText, MessageSquare, Package, ShieldCheck, CheckCircle2, 
  Search, Filter, ChevronRight, AlertCircle 
} from 'lucide-react';
import { 
  getAdminStats, getQuoteRequests, updateQuoteStatus, 
  getContactInquiries, updateInquiryStatus, getProducts, 
  getCategories, createProduct, deleteProduct, adminLogout, 
  getStoredAdminUser, isUserLoggedIn 
} from '../services/api';

export default function AdminDashboardPage({ onToast }) {
  const navigate = useNavigate();
  const adminUser = getStoredAdminUser();

  const [activeTab, setActiveTab] = useState('quotes');
  const [stats, setStats] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Add Product Form state
  const [showAddModal, setShowAddModal] = useState(false);
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
    if (!isUserLoggedIn()) {
      navigate('/admin');
      return;
    }
    fetchAdminData();
  }, []);

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
      if (err.response?.status === 401 || err.response?.status === 403) {
        adminLogout();
        navigate('/admin');
      } else {
        if (onToast) onToast('Failed to load dashboard data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    if (onToast) onToast('Logged out successfully.', 'info');
    navigate('/admin');
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateQuoteStatus(id, status);
      if (res.success) {
        setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
        if (onToast) onToast('Quote status updated!', 'success');
        // Update stats
        fetchAdminData();
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
        fetchAdminData();
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
        if (onToast) onToast('New product saved to database!', 'success');
        setShowAddModal(false);
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
      }
    } catch (err) {
      if (onToast) onToast('Failed to create product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
        if (onToast) onToast('Product deleted from database', 'success');
        fetchAdminData();
      }
    } catch (err) {
      if (onToast) onToast('Failed to delete product', 'error');
    }
  };

  const filteredQuotes = quotes.filter(q => 
    !searchFilter || 
    q.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (q.company && q.company.toLowerCase().includes(searchFilter.toLowerCase())) ||
    (q.email && q.email.toLowerCase().includes(searchFilter.toLowerCase())) ||
    (q.material && q.material.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="admin-page-layout">
      {/* Top Standalone Admin Navbar */}
      <header className="admin-header-bar">
        <div className="admin-header-inner">
          <div className="admin-header-left">
            <span className="brand-mark" style={{ width: '42px', height: 'auto' }}>
              <img src="/logo/sde-logo-white.svg" alt="SDE logo" />
            </span>
            <div>
              <h3 style={{ fontSize: '16px', color: 'var(--white)', letterSpacing: '0.02em' }}>
                SDE Engineering &middot; Administration Console
              </h3>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-bright)' }}>
                <Database size={11} style={{ display: 'inline', marginRight: '4px' }} />
                MySQL Engine: {stats?.dbMode || 'Live'}
              </span>
            </div>
          </div>

          <div className="admin-header-right">
            <Link to="/" target="_blank" className="btn btn-ghost btn-sm" title="Open public website in new tab">
              <ExternalLink size={14} /> View Website
            </Link>
            <button 
              type="button" 
              onClick={fetchAdminData} 
              className="btn btn-outline-accent btn-sm"
              title="Refresh database records"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>
            <div className="admin-user-pill">
              <span className="admin-user-avatar">
                {adminUser?.username?.substring(0, 2).toUpperCase() || 'AD'}
              </span>
              <span>{adminUser?.name || 'Administrator'}</span>
            </div>
            <button 
              type="button" 
              onClick={handleLogout} 
              className="btn btn-primary btn-sm"
              title="Sign Out"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Body */}
      <div className="admin-body-wrap">
        {/* KPI Metrics */}
        {stats && (
          <div className="admin-kpi-grid" style={{ marginBottom: '32px' }}>
            <div className="admin-kpi-card">
              <div className="num">{stats.totalQuotes}</div>
              <div className="lbl">Total RFQ Quotes ({stats.pendingQuotes} Pending Review)</div>
            </div>
            <div className="admin-kpi-card">
              <div className="num">{stats.totalInquiries}</div>
              <div className="lbl">Contact Inquiries ({stats.newInquiries} Unread)</div>
            </div>
            <div className="admin-kpi-card">
              <div className="num">{stats.totalProducts}</div>
              <div className="lbl">Active Products in MySQL Database</div>
            </div>
            <div className="admin-kpi-card">
              <div className="num">{stats.totalCategories}</div>
              <div className="lbl">Polymer Categories</div>
            </div>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="admin-panel-box">
          <div className="admin-tabs" style={{ padding: '0 24px', paddingTop: '16px' }}>
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

          {/* TAB 1: RFQ QUOTES */}
          {activeTab === 'quotes' && (
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div className="catalog-search" style={{ maxWidth: '340px' }}>
                  <Search size={15} />
                  <input 
                    type="text" 
                    placeholder="Search by client, company, or material..." 
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{ background: 'var(--paper)', color: 'var(--navy-deep)', borderColor: 'var(--line-dark)' }}
                  />
                </div>
                <span className="mono" style={{ fontSize: '13px', color: 'var(--steel)' }}>
                  Showing {filteredQuotes.length} quotes
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Submission Date</th>
                      <th>Client Details</th>
                      <th>Contact Info</th>
                      <th>Material &amp; Durometer</th>
                      <th>Qty &amp; Spec Notes</th>
                      <th>Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotes.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--steel)' }}>
                          No quote inquiries match your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredQuotes.map(q => (
                        <tr key={q.id}>
                          <td className="mono" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {new Date(q.created_at || Date.now()).toLocaleDateString()}<br />
                            <small style={{ color: 'var(--steel)' }}>{new Date(q.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                          </td>
                          <td>
                            <strong>{q.name}</strong>
                            {q.company && <div style={{ fontSize: '12.5px', color: 'var(--steel)' }}>🏢 {q.company}</div>}
                          </td>
                          <td>
                            <div>📞 <a href={`tel:${q.phone}`}>{q.phone}</a></div>
                            <div style={{ fontSize: '12px', color: 'var(--steel)' }}>✉️ <a href={`mailto:${q.email}`}>{q.email}</a></div>
                          </td>
                          <td>
                            <div><strong>{q.material || 'Custom Polymer'}</strong></div>
                            <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)' }}>
                              Hardness: {q.shore_hardness || 'Standard'}
                            </div>
                          </td>
                          <td>
                            <div>Quantity: <strong>{q.quantity || '1'}</strong></div>
                            {q.application_details && <div style={{ fontSize: '12px', color: 'var(--steel)' }}>Medium: {q.application_details}</div>}
                            {q.drawing_notes && <div style={{ fontSize: '12px', color: 'var(--navy-mid)', fontStyle: 'italic', maxWidth: '240px' }}>"{q.drawing_notes}"</div>}
                          </td>
                          <td>
                            <select 
                              value={q.status} 
                              onChange={(e) => handleStatusChange(q.id, e.target.value)}
                              className={`status-badge status-${q.status}`}
                              style={{ border: 'none', cursor: 'pointer', padding: '6px 10px' }}
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
            </div>
          )}

          {/* TAB 2: CONTACT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div style={{ padding: '24px' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Sender</th>
                      <th>Contact Info</th>
                      <th>Subject</th>
                      <th>Message Body</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--steel)' }}>
                          No contact messages received yet.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map(inq => (
                        <tr key={inq.id}>
                          <td className="mono" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {new Date(inq.created_at || Date.now()).toLocaleDateString()}
                          </td>
                          <td><strong>{inq.name}</strong></td>
                          <td>
                            <div>✉️ <a href={`mailto:${inq.email}`}>{inq.email}</a></div>
                            {inq.phone && <div style={{ fontSize: '12px', color: 'var(--steel)' }}>📞 {inq.phone}</div>}
                          </td>
                          <td><strong>{inq.subject || 'General Inquiry'}</strong></td>
                          <td style={{ maxWidth: '340px', fontSize: '13.5px', lineHeight: 1.5 }}>
                            {inq.message}
                          </td>
                          <td>
                            <select 
                              value={inq.status} 
                              onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                              className={`status-badge status-${inq.status}`}
                              style={{ border: 'none', cursor: 'pointer', padding: '6px 10px' }}
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
            </div>
          )}

          {/* TAB 3: PRODUCT CATALOG CRUD */}
          {activeTab === 'products' && (
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '18px', color: 'var(--navy-deep)' }}>
                    Active Catalog Items ({products.length})
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--steel)' }}>
                    Add, manage or remove polymer products displayed on the public catalog.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowAddModal(!showAddModal)}
                >
                  <Plus size={15} /> {showAddModal ? 'Cancel' : 'Add New Product'}
                </button>
              </div>

              {/* Add Product Inline Form */}
              {showAddModal && (
                <form onSubmit={handleAddProduct} style={{ background: 'var(--paper)', padding: '24px', borderRadius: '4px', marginBottom: '24px', border: '1px solid var(--line-dark)' }}>
                  <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>
                    Add New Engineered Polymer Product
                  </h4>
                  
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
                      <label>Product Category</label>
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
                      <label>Shore Hardness Durometer</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. 70A–95A Shore" 
                        value={newProd.shore_hardness} 
                        onChange={(e) => setNewProd({ ...newProd, shore_hardness: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Working Temperature Rating</label>
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
                      placeholder="e.g. Cast PU (MDI-based), Virgin PTFE, NBR 70" 
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      <input 
                        type="checkbox" 
                        checked={newProd.is_featured} 
                        onChange={(e) => setNewProd({ ...newProd, is_featured: e.target.checked })} 
                      />
                      Feature this product in 'Featured Products' on homepage
                    </label>
                    <button type="submit" className="btn btn-secondary">
                      Save Product to MySQL
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Shore Hardness</th>
                      <th>Temp Rating</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.name}</strong>
                          {p.subtitle && <div style={{ fontSize: '12px', color: 'var(--steel)' }}>{p.subtitle}</div>}
                        </td>
                        <td>{p.category_name || p.category_code || 'General'}</td>
                        <td className="mono">{p.shore_hardness || '—'}</td>
                        <td className="mono">{p.temp_rating || '—'}</td>
                        <td>{p.is_featured ? <span style={{ color: '#28a745', fontWeight: 600 }}>⭐ Featured</span> : 'Standard'}</td>
                        <td>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteProduct(p.id)}
                            style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: '4px' }}
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
    </div>
  );
}
