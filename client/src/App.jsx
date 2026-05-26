import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';

import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/common/ScrollToTop';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import AdsManagement from './pages/admin/AdsManagement';
import { GlobalProvider } from './context/GlobalContext';

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen font-sans flex flex-col bg-transparent">
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="category/:categoryName" element={<CategoryPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>

          {/* Admin Panel Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="ads" element={<AdsManagement />} />
            {/* Placeholder for Listings page */}
            <Route path="listings" element={<div className="p-8">Listings Module Coming Soon</div>} />
            <Route path="settings" element={<div className="p-8">Settings Module Coming Soon</div>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
