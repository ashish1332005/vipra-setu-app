import React, { createContext, useState, useContext } from 'react';
import { MOCK_ADS_CONFIG, MOCK_USERS } from '../data/adminData';
import { WORKERS } from '../data/marketplace';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  // Unify workers into the user pool so we can manage them from admin
  const initialUsers = [
    ...MOCK_USERS,
    ...WORKERS.map(worker => ({
      ...worker, // preserve all worker specific fields
      email: `${worker.name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: '9876500000',
      role: 'Provider',
      status: 'Active',
      joined: '2026-05-01'
    }))
  ];

  const [users, setUsers] = useState(initialUsers);
  
  // We need to support the Category Banner Ad specifically. 
  // We'll create some rich mock ads that match the structure of CategoryBannerAd.
  const initialAds = [
    {
      id: 'A001',
      type: 'Category Banner',
      location: 'Event',
      status: 'Active',
      clicks: 1250,
      impressions: 45000,
      revenue: 1500,
      
      // Visual properties for CategoryBannerAd
      categoryLabel: "AC & Non AC Banquet Hall",
      title: "Aashika Park",
      phone: "9829 045 662",
      mainImage: "https://images.unsplash.com/photo-1541882662098-90059bc2c676?q=80&w=800&auto=format&fit=crop",
      img1: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
      img2: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop",
      brandColor: "#b81d32",
      textColor: "#60272b"
    },
    {
      id: 'A002',
      type: 'Category Banner',
      location: 'Beauty',
      status: 'Active',
      clicks: 840,
      impressions: 32000,
      revenue: 800,
      
      categoryLabel: "Luxury Spa & Wellness",
      title: "Serenity Spa",
      phone: "9811 223 344",
      mainImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
      img1: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
      img2: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
      brandColor: "#059669",
      textColor: "#064e3b"
    }
  ];

  const [ads, setAds] = useState(initialAds);

  // Actions
  const toggleAdStatus = (adId) => {
    setAds(ads.map(ad => 
      ad.id === adId ? { ...ad, status: ad.status === 'Active' ? 'Paused' : 'Active' } : ad
    ));
  };

  const createAd = (newAd) => {
    setAds([newAd, ...ads]);
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Banned' : 'Active' } : user
    ));
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <GlobalContext.Provider value={{
      users,
      ads,
      toggleAdStatus,
      createAd,
      toggleUserStatus,
      deleteUser
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
