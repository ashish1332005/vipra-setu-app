import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';

import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/common/ScrollToTop';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import AdsManagement from './pages/admin/AdsManagement';
import RequestsManagement from './pages/admin/RequestsManagement';
import ProvidersModeration from './pages/admin/ProvidersModeration';
import ServicesModeration from './pages/admin/ServicesModeration';
import TrustManagement from './pages/admin/TrustManagement';
import BusinessSettings from './pages/admin/BusinessSettings';
import RoleDashboardRedirect from './pages/dashboard/RoleDashboardRedirect';
import ProviderDashboard from './pages/dashboard/ProviderDashboard';
import ProviderProfile from './pages/dashboard/ProviderProfile';
import ProviderGrowth from './pages/dashboard/ProviderGrowth';
import ProviderBusinessSuite from './pages/dashboard/ProviderBusinessSuite';
import ProviderServices from './pages/dashboard/ProviderServices';
import ProviderRequests from './pages/dashboard/ProviderRequests';
import TakerDashboard from './pages/dashboard/TakerDashboard';
import TakerProviders from './pages/dashboard/TakerProviders';
import TakerRequests from './pages/dashboard/TakerRequests';
import TakerBookingAssistant from './pages/dashboard/TakerBookingAssistant';
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
            <Route path="dashboard" element={<RoleDashboardRedirect />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />

          <Route path="/provider" element={<DashboardLayout role="service_provider" />}>
            <Route index element={<ProviderDashboard />} />
            <Route path="profile" element={<ProviderProfile />} />
            <Route path="growth" element={<ProviderGrowth />} />
            <Route path="business" element={<ProviderBusinessSuite />} />
            <Route path="services" element={<ProviderServices />} />
            <Route path="requests" element={<ProviderRequests />} />
          </Route>

          <Route path="/taker" element={<DashboardLayout role="service_taker" />}>
            <Route index element={<TakerDashboard />} />
            <Route path="book" element={<TakerBookingAssistant />} />
            <Route path="providers" element={<TakerProviders />} />
            <Route path="requests" element={<TakerRequests />} />
          </Route>

          {/* Admin Panel Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="providers" element={<ProvidersModeration />} />
            <Route path="services" element={<ServicesModeration />} />
            <Route path="ads" element={<AdsManagement />} />
            <Route path="requests" element={<RequestsManagement />} />
            <Route path="trust" element={<TrustManagement />} />
            <Route path="business" element={<BusinessSettings />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
