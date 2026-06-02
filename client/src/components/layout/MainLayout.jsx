import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import AdPlacement from '../ads/AdPlacement';
import Footer from './Footer';

const MainLayout = () => {
  const location = useLocation();
  const isServicesPage = location.pathname === '/services';
  const isCategoryPage = location.pathname.startsWith('/category/');
  const placement = isServicesPage || isCategoryPage ? 'services' : 'all';
  const categorySlug = isCategoryPage ? location.pathname.replace(/^\/category\//, '') : '';
  const category = categorySlug
    ? decodeURIComponent(categorySlug)
    : '';

  return (
    <>
      <Navbar />
      <AdPlacement placement={placement} category={category} />
      <main className="flex-grow pb-24 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
