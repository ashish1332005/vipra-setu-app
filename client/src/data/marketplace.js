export const SERVICE_CATEGORIES = [
  {
    id: 1,
    name: 'Household',
    aliases: ['Home Services'],
    description: 'Cleaning, repairs, maintenance, and day-to-day home support.',
    shortDescription: 'Plumbing, electrical, AC, RO and vehicle repair',
    count: '120+ Pros',
    workTypes: ['Plumber', 'Electrician', 'AC repairing', 'Two wheeler repairing', 'Four wheeler service', 'RO / water purifier'],
  },
  {
    id: 2,
    name: 'Event',
    aliases: ['Events'],
    description: 'Decorators, coordinators, photographers, and event specialists.',
    shortDescription: 'Tent, light, DJ, photography, catering and pandit ji',
    count: '80+ Teams',
    workTypes: ['Tent and light', 'DJ', 'Photographer', 'Catering', 'Halwai', 'Band and ghodi', 'Pandit ji'],
  },
  {
    id: 3,
    name: 'Education',
    aliases: ['Educational'],
    description: 'Tutors, trainers, and learning support for every age group.',
    shortDescription: 'School, home classes, coaching and computer classes',
    count: '65+ Tutors',
    workTypes: ['School', 'Home classes', 'Coaching center', 'Spoken classes', 'Library', 'College', 'Computer classes'],
  },
  {
    id: 4,
    name: 'Hospital',
    aliases: ['Hospital service', 'Medical'],
    description: 'Medical support, home care, physiotherapy, and hospital help.',
    shortDescription: 'Medical, home care, physio and diagnostics',
    count: '50+ Clinics',
    workTypes: ['Medical', 'Home care', 'Physio', 'Hospital support', 'Diagnostic', 'Ambulance'],
  },
  {
    id: 5,
    name: 'Property and Rent',
    aliases: ['Property & rent'],
    description: 'Agents, managers, and on-ground rental support experts.',
    shortDescription: 'Rental house, property dealer and rent support',
    count: '90+ Agents',
    workTypes: ['Rental house', 'Property dealer', 'Room and PG', 'Shop rent', 'Plot and land'],
  },
  {
    id: 6,
    name: 'Hotels and Restaurant',
    aliases: ['Hotels', 'Hotel & Restaurant'],
    description: 'Hospitality professionals for food, stays, and guest support.',
    shortDescription: 'Hotel, restaurant, catering and food service',
    count: '110+ Places',
    workTypes: ['Hotel', 'Restaurant', 'Cafe', 'Tiffin service', 'Chef', 'Catering support'],
  },
  {
    id: 7,
    name: 'Other Services',
    aliases: ['Other', 'Other Service'],
    description: 'Placement, finance, construction, design, and business support.',
    shortDescription: 'Jobs, loans, insurance, construction and design',
    count: '150+ Experts',
    workTypes: ['Placement and job', 'Loans', 'Insurance', 'Construction', 'Architect', 'Interior designer', 'Furniture', 'Hardware and accessories'],
  },
];

export const CATEGORIES = SERVICE_CATEGORIES.map(({ id, name, description }) => ({
  id,
  name,
  description,
}));

export const getCategoryConfig = (categoryName = '') => {
  const normalizedName = categoryName.trim().toLowerCase();

  return SERVICE_CATEGORIES.find((category) => {
    const names = [category.name, ...(category.aliases || [])];
    return names.some((name) => name.toLowerCase() === normalizedName);
  });
};

export const isSameCategory = (workerCategory = '', selectedCategory = '') => {
  const category = getCategoryConfig(selectedCategory);
  const names = category ? [category.name, ...(category.aliases || [])] : [selectedCategory];

  return names.some((name) => name.toLowerCase() === workerCategory.toLowerCase());
};

export const WORKERS = [
  { id: 1, name: 'Rajesh Sharma', category: 'Household', rating: 4.8, rate: '₹400/visit', exp: '5 Yrs', city: 'Bhilwara', availability: 'Available today', tags: ['Electrician', 'Wiring'] },
  { id: 2, name: 'Mahesh Suthar', category: 'Household', rating: 4.7, rate: '₹350/visit', exp: '7 Yrs', city: 'Bhilwara', availability: 'Available today', tags: ['Plumber', 'Pipe repair'] },
  { id: 3, name: 'Imran Khan', category: 'Household', rating: 4.6, rate: '₹500/visit', exp: '6 Yrs', city: 'Bhilwara', availability: 'Open this week', tags: ['AC repairing', 'RO service'] },
  { id: 4, name: 'Bob Johnson', category: 'Event', rating: 4.7, rate: '₹8,000/event', exp: '3 Yrs', city: 'Bhilwara', availability: 'Weekend slots open', tags: ['DJ', 'Sound'] },
  { id: 5, name: 'Lisa Taylor', category: 'Event', rating: 4.9, rate: '₹12,000/event', exp: '6 Yrs', city: 'Bhilwara', availability: 'Book 48h ahead', tags: ['Photographer', 'Editing'] },
  { id: 6, name: 'Om Tent House', category: 'Event', rating: 4.8, rate: 'Custom quote', exp: '9 Yrs', city: 'Bhilwara', availability: 'Wedding season open', tags: ['Tent and light', 'Catering'] },
  { id: 7, name: 'Alice Smith', category: 'Education', rating: 4.9, rate: '₹500/hr', exp: '8 Yrs', city: 'Bhilwara', availability: 'Open this week', tags: ['Home classes', 'Science'] },
  { id: 8, name: 'Ravi Coaching Center', category: 'Education', rating: 4.6, rate: 'Monthly plans', exp: '10 Yrs', city: 'Bhilwara', availability: 'New batch open', tags: ['Coaching center', 'Computer classes'] },
  { id: 9, name: 'David Lee', category: 'Hospital', rating: 5.0, rate: '₹700/shift', exp: '10 Yrs', city: 'Bhilwara', availability: 'Night shift ready', tags: ['Home care', 'Caregiver'] },
  { id: 10, name: 'Seva Physio Care', category: 'Hospital', rating: 4.8, rate: '₹600/session', exp: '6 Yrs', city: 'Bhilwara', availability: 'Available tomorrow', tags: ['Physio', 'Medical'] },
  { id: 11, name: 'Mike Brown', category: 'Property and Rent', rating: 4.8, rate: '1 month brokerage', exp: '7 Yrs', city: 'Bhilwara', availability: 'Available today', tags: ['Property dealer', 'Rental house'] },
  { id: 12, name: 'Shree Rent Desk', category: 'Property and Rent', rating: 4.5, rate: 'Custom quote', exp: '4 Yrs', city: 'Bhilwara', availability: 'Open this week', tags: ['Room and PG', 'Shop rent'] },
  { id: 13, name: 'Emma Davis', category: 'Hotels and Restaurant', rating: 4.6, rate: '₹1,500/day', exp: '4 Yrs', city: 'Bhilwara', availability: 'Seasonal booking open', tags: ['Chef', 'Catering support'] },
  { id: 14, name: 'Royal Bhoj Restaurant', category: 'Hotels and Restaurant', rating: 4.7, rate: 'Menu pricing', exp: '8 Yrs', city: 'Bhilwara', availability: 'Open now', tags: ['Restaurant', 'Tiffin service'] },
  { id: 15, name: 'Vipra Placement Desk', category: 'Other Services', rating: 4.5, rate: 'Custom quote', exp: '5 Yrs', city: 'Bhilwara', availability: 'Available today', tags: ['Placement and job', 'Loans'] },
  { id: 16, name: 'Aarav Build Studio', category: 'Other Services', rating: 4.8, rate: 'Project based', exp: '9 Yrs', city: 'Bhilwara', availability: 'Site visit open', tags: ['Construction', 'Interior designer'] },
];
