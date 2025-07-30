import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NFTProvider } from './context/NFTContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/Index';

function App() {
  return (
    <>
        <Router>
      <NFTProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
          </div>
      </NFTProvider>
        </Router>
    </>
  )
}

export default App
