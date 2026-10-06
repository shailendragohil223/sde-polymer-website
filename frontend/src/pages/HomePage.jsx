import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SpecTicker from '../components/SpecTicker';
import AboutSection from '../components/AboutSection';
import ProductCatalog from '../components/ProductCatalog';
import FeaturedProducts from '../components/FeaturedProducts';
import IndustriesSection from '../components/IndustriesSection';
import WhyChooseSection from '../components/WhyChooseSection';
import ProcessSection from '../components/ProcessSection';
import ApplicationsSection from '../components/ApplicationsSection';
import TrustSection from '../components/TrustSection';
import CtaBand from '../components/CtaBand';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';
import QuoteModal from '../components/QuoteModal';
import ProductDetailModal from '../components/ProductDetailModal';
import { getSiteInfo, getCategories, getProducts } from '../services/api';

export default function HomePage({ onToast }) {
  const [siteInfo, setSiteInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);

  const loadData = async () => {
    try {
      const [infoRes, catsRes, prodsRes] = await Promise.all([
        getSiteInfo(),
        getCategories(),
        getProducts()
      ]);

      if (infoRes.success) setSiteInfo(infoRes.data);
      if (catsRes.success) setCategories(catsRes.data);
      if (prodsRes.success) setProducts(prodsRes.data);
    } catch (err) {
      console.error('Failed to load application data:', err);
      if (onToast) onToast('Connecting to local API server...', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenQuote = (product = null) => {
    setSelectedProductForQuote(product);
    setQuoteModalOpen(true);
  };

  const handleOpenDetail = (product) => {
    setDetailProduct(product);
  };

  return (
    <div className="home-page-container">
      {/* Header Navigation without admin button */}
      <Header 
        siteInfo={siteInfo} 
        onOpenQuote={() => handleOpenQuote()} 
      />

      <main>
        {/* Hero Section */}
        <Hero 
          siteInfo={siteInfo} 
          onOpenQuote={() => handleOpenQuote()} 
        />

        {/* Dynamic Spec Ticker */}
        <SpecTicker specs={siteInfo?.specsTicker} />

        {/* About Company Section */}
        <AboutSection siteInfo={siteInfo} />

        {/* Dynamic Product Catalog & Category Explorer */}
        <ProductCatalog 
          categories={categories} 
          products={products} 
          onSelectProduct={handleOpenDetail} 
          onOpenQuote={handleOpenQuote}
          onSelectCategory={(code) => console.log('Selected category', code)}
        />

        {/* Featured Products */}
        <FeaturedProducts 
          products={products} 
          onSelectProduct={handleOpenDetail} 
          onOpenQuote={handleOpenQuote} 
        />

        {/* Industries Served */}
        <IndustriesSection industries={siteInfo?.industries} />

        {/* Why Choose Us */}
        <WhyChooseSection whyChoose={siteInfo?.whyChoose} />

        {/* Manufacturing Process */}
        <ProcessSection processSteps={siteInfo?.processSteps} />

        {/* Industrial Machinery Applications */}
        <ApplicationsSection applications={siteInfo?.applications} />

        {/* Trust Points */}
        <TrustSection trustPoints={siteInfo?.trustPoints} />

        {/* Call to Action Banner */}
        <CtaBand 
          siteInfo={siteInfo} 
          onOpenQuote={() => handleOpenQuote()} 
        />

        {/* Contact & Location */}
        <ContactSection 
          siteInfo={siteInfo} 
          onToast={onToast} 
        />
      </main>

      {/* Footer */}
      <Footer siteInfo={siteInfo} />

      {/* Floating Call-to-actions */}
      <FloatingActions 
        siteInfo={siteInfo} 
        onOpenQuote={() => handleOpenQuote()} 
      />

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={detailProduct} 
        onClose={() => setDetailProduct(null)} 
        onOpenQuote={handleOpenQuote} 
      />

      {/* Online RFQ Quote Calculator Modal */}
      <QuoteModal 
        isOpen={quoteModalOpen} 
        onClose={() => { setQuoteModalOpen(false); setSelectedProductForQuote(null); }} 
        selectedProduct={selectedProductForQuote}
        onToast={onToast}
      />
    </div>
  );
}
