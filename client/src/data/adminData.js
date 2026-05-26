export const ADMIN_STATS = {
  currentEarnings: 45280,
  activeUsers: 1243,
  totalUsers: 15892,
  totalProfessionals: 845,
  pendingApprovals: 12,
};

export const MOCK_USERS = [
  { id: 'U101', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '9876543210', role: 'User', status: 'Active', joined: '2026-01-15' },
  { id: 'U102', name: 'Priya Patel', email: 'priya.p@example.com', phone: '9876543211', role: 'Provider', status: 'Active', joined: '2026-02-10' },
  { id: 'U103', name: 'Amit Singh', email: 'amit.s@example.com', phone: '9876543212', role: 'Provider', status: 'Pending', joined: '2026-05-11' },
  { id: 'U104', name: 'Sneha Gupta', email: 'sneha.g@example.com', phone: '9876543213', role: 'User', status: 'Banned', joined: '2025-11-20' },
  { id: 'U105', name: 'Vikram Joshi', email: 'vikram.j@example.com', phone: '9876543214', role: 'User', status: 'Active', joined: '2026-04-05' },
  { id: 'U106', name: 'Neha Reddy', email: 'neha.r@example.com', phone: '9876543215', role: 'Provider', status: 'Active', joined: '2026-03-22' },
];

export const MOCK_ADS_CONFIG = [
  { id: 'A001', title: 'Aashika Park Banquet', type: 'Category Banner', location: 'Event Category', status: 'Active', clicks: 1250, impressions: 45000, revenue: 1500 },
  { id: 'A002', title: 'Serenity Spa Offer', type: 'Category Banner', location: 'Beauty Category', status: 'Active', clicks: 840, impressions: 32000, revenue: 800 },
  { id: 'A003', title: 'Royal Bites Catering', type: 'Category Banner', location: 'Event Category', status: 'Paused', clicks: 420, impressions: 15000, revenue: 450 },
  { id: 'A004', title: 'Deep Cleaning Flash Sale', type: 'Rail Text Ad', location: 'Global Rail', status: 'Active', clicks: 3100, impressions: 120000, revenue: 3500 },
];
