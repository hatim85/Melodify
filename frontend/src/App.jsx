import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NFTProvider } from './context/NFTContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/Index';

function App() {
  return (
    <Router>
      <NFTProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
            <Navbar />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
        </div>
      </NFTProvider>
    </Router>
  )
}

export default App
