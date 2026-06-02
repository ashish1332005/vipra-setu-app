import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import AdPlacement from '../ads/AdPlacement';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <AdPlacement placement="all" />
      <main className="flex-grow pb-24 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
