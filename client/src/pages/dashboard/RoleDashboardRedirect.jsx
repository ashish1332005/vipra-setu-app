import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/GlobalContext';

const RoleDashboardRedirect = () => {
  const { currentUser } = useGlobalContext();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
  if (currentUser.role === 'service_provider') return <Navigate to="/provider" replace />;

  return <Navigate to="/taker" replace />;
};

export default RoleDashboardRedirect;
