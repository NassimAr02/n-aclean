import { useState } from 'react';
import AdminPage from '@/components/admin/AdminPage';
import Audiences from '@/components/Audiences';
import Coverage from '@/components/Coverage';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Process from '@/components/Process';
import QuoteSection from '@/components/QuoteSection';
import Services from '@/components/Services';
import type { ClientType } from '@/lib/quoteRequests';

function App() {
  const [clientType, setClientType] = useState<ClientType>('particulier');

  const chooseClientType = (type: ClientType) => {
    setClientType(type);
    document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (window.location.pathname.replace(/\/+$/, '') === '/admin') {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Header />
      <main>
        <Hero />
        <Audiences onSelect={chooseClientType} />
        <Services />
        <Process />
        <Coverage />
        <Faq />
        <QuoteSection clientType={clientType} onClientTypeChange={setClientType} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
