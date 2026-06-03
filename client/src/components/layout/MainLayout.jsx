import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import AdPlacement from '../ads/AdPlacement';
import Footer from './Footer';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isServicesPage = location.pathname === '/services';
  const isCategoryPage = location.pathname.startsWith('/category/');
  const placement = isHomePage ? 'home' : isServicesPage ? 'services' : isCategoryPage ? 'category' : 'all';
  const categorySlug = isCategoryPage ? location.pathname.replace(/^\/category\//, '') : '';
  const category = categorySlug ? decodeURIComponent(categorySlug) : '';

  return (
    <>
      <Navbar />
      <AdPlacement placement={placement} category={category} />
      <AdPlacement
        placement="sidebar"
        pagePlacement={placement}
        category={category}
        limit={1}
        className="mx-3 mt-3 xl:hidden"
      />
      <AdPlacement
        placement="sidebar"
        pagePlacement={placement}
        category={category}
        limit={2}
        className="pointer-events-auto fixed right-3 top-32 z-30 hidden w-44 xl:block 2xl:right-6 2xl:w-52"
      />
      <main className="flex-grow pb-24 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
