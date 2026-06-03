import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { mergeServiceCategories, toCategoryOptions } from '../data/marketplace';
import { getApiErrorMessage } from '../utils/apiError';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authLoading, setAuthLoading] = useState(() => Boolean(localStorage.getItem('token')));
  const [authError, setAuthError] = useState('');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categoryConfigs, setCategoryConfigs] = useState([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState(true);
  const [marketplaceError, setMarketplaceError] = useState('');
  const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(false);

  const loadMarketplace = useCallback(async () => {
    setMarketplaceLoading(true);
    setMarketplaceError('');

    try {
      const [servicesRes, providersRes, categoriesRes] = await Promise.all([
        api.get('/services'),
        api.get('/providers'),
        api.get('/categories').catch(() => ({ data: { categories: [] } })),
      ]);
      setServices(servicesRes.data.services || []);
      setProviders(providersRes.data.providers || []);
      setCategoryConfigs(categoriesRes.data.categories || []);
    } catch (error) {
      setMarketplaceError(getApiErrorMessage(error, 'Unable to load live services'));
    } finally {
      setMarketplaceLoading(false);
    }
  }, []);

  const loadAds = useCallback(async ({ admin = false } = {}) => {
    setAdsLoading(true);

    try {
      const { data } = await api.get(admin ? '/admin/ads' : '/ads', {
        params: admin || !currentUser?.role ? undefined : { role: currentUser.role },
      });
      setAds(data.ads || []);
    } catch {
      setAds([]);
    } finally {
      setAdsLoading(false);
    }
  }, [currentUser?.role]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    loadMarketplace();
    if (!token) return;

    setAuthLoading(true);
    api.get('/auth/me')
      .then(({ data }) => {
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, [loadMarketplace]);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  const toggleAdStatus = async (adId) => {
    const ad = ads.find((item) => item._id === adId || item.id === adId);
    const nextStatus = ad?.status === 'Active' ? 'Paused' : 'Active';
    const { data } = await api.patch(`/admin/ads/${adId}`, { status: nextStatus });
    setAds((currentAds) => currentAds.map((item) => (item._id === adId || item.id === adId ? data.ad : item)));
    return data.ad;
  };

  const createAd = async (newAd) => {
    const { data } = await api.post('/admin/ads', newAd);
    setAds((currentAds) => [data.ad, ...currentAds]);
    return data.ad;
  };

  const deleteAd = async (adId) => {
    await api.delete(`/admin/ads/${adId}`);
    setAds((currentAds) => currentAds.filter((item) => item._id !== adId && item.id !== adId));
  };

  const login = async ({ phone, password }) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const { data } = await api.post('/auth/login', { phone, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Login failed');
      setAuthError(message);
      throw new Error(message, { cause: error });
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async ({ name, phone, password, role }) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const { data } = await api.post('/auth/register', { name, phone, password, role });
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
      }
      return data;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Registration failed');
      setAuthError(message);
      throw new Error(message, { cause: error });
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const { data } = await api.post('/auth/verify-email', { token });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Email verification failed');
      setAuthError(message);
      throw new Error(message, { cause: error });
    } finally {
      setAuthLoading(false);
    }
  };

  const resendVerification = async (email) => {
    const { data } = await api.post('/auth/resend-verification', { email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const loadAdminUsers = useCallback(async () => {
    setUsersLoading(true);

    try {
      const { data } = await api.get('/admin/users');
      const mappedUsers = data.users.map((user) => ({
        id: user._id,
        name: user.name,
        email: getDisplayEmail(user.email),
        phone: user.phone,
        role: formatRole(user.role),
        rawRole: user.role,
        status: formatStatus(user.status),
        rawStatus: user.status,
        joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-',
      }));
      setUsers(mappedUsers);
      return mappedUsers;
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const toggleUserStatus = async (userId) => {
    const user = users.find((item) => item.id === userId);
    const nextStatus = user?.rawStatus === 'active' ? 'banned' : 'active';

    const { data } = await api.patch(`/admin/users/${userId}/status`, { status: nextStatus });

    setUsers(users.map(item =>
      item.id === userId
        ? {
            ...item,
            status: formatStatus(data.user.status),
            rawStatus: data.user.status,
          }
        : item
    ));
  };

  const approveProvider = async (userId) => {
    await api.patch(`/admin/providers/${userId}/approve`);

    setUsers(users.map((item) =>
      item.id === userId
        ? { ...item, status: 'Active', rawStatus: 'active' }
        : item
    ));
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const serviceCountByProvider = services.reduce((counts, service) => {
    const providerId = typeof service.provider === 'object' ? service.provider?._id : service.provider;
    if (providerId) counts[providerId] = (counts[providerId] || 0) + 1;
    return counts;
  }, {});
  const serviceCategories = mergeServiceCategories(categoryConfigs);
  const categoryOptions = toCategoryOptions(serviceCategories);
  const marketplaceWorkers = providers.map((provider) => mapProviderToWorker(provider, serviceCountByProvider));

  return (
    <GlobalContext.Provider value={{
      users,
      usersLoading,
      ads,
      adsLoading,
      services,
      providers,
      serviceCategories,
      categoryOptions,
      marketplaceWorkers,
      marketplaceLoading,
      marketplaceError,
      loadMarketplace,
      currentUser,
      authLoading,
      authError,
      login,
      register,
      verifyEmail,
      resendVerification,
      logout,
      loadAdminUsers,
      approveProvider,
      loadAds,
      toggleAdStatus,
      createAd,
      deleteAd,
      toggleUserStatus,
      deleteUser
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

const formatRole = (role = '') => {
  const labels = {
    service_provider: 'Provider',
    service_taker: 'User',
    admin: 'Admin',
  };

  return labels[role] || role;
};

const formatStatus = (status = '') => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const mapProviderToWorker = (provider, serviceCountByProvider = {}) => {
  const user = provider.user || {};
  const displayName = provider.businessName || user.name || 'Service Provider';
  const skillTags = provider.skills?.length ? provider.skills : [provider.category].filter(Boolean);
  const completedFields = [
    displayName,
    provider.category,
    provider.city,
    provider.address,
    provider.rate,
    provider.availability,
    skillTags.length,
  ].filter(Boolean).length;
  const profileScore = Math.min(100, Math.round((completedFields / 7) * 100));

  return {
    id: provider._id,
    providerId: provider._id,
    userId: user._id,
    name: displayName,
    category: provider.category,
    rating: provider.rating || 0,
    rate: provider.rate || 'Custom quote',
    exp: `${provider.experienceYears || 0} yrs`,
    city: provider.city,
    location: provider.city,
    availability: provider.availability || 'Available',
    tags: skillTags,
    phone: user.phone,
    email: getDisplayEmail(user.email),
    isApproved: provider.isApproved,
    status: user.status,
    profileScore,
    serviceCount: serviceCountByProvider[user._id] || 0,
    responseLabel: provider.availability?.toLowerCase().includes('today') ? 'Fast response' : 'Listed provider',
  };
};

const getDisplayEmail = (email = '') => email.endsWith('@mobile.local') ? '' : email;
