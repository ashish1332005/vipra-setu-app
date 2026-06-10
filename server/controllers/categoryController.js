const CategoryConfig = require('../models/CategoryConfig');
const asyncHandler = require('../utils/asyncHandler');

const defaultCategories = [
  {
    name: 'Electrician',
    description: 'Switch, wiring, fittings and electrical repair.',
    serviceTypes: ['Electrical Repair', 'Wiring', 'Switch Fitting'],
    isActive: true,
  },
  {
    name: 'Plumber',
    description: 'Leakage, taps, pipes and bathroom fittings.',
    serviceTypes: ['Plumbing Service', 'Leak Repair', 'Tap Fitting'],
    isActive: true,
  },
  {
    name: 'Carpenter',
    description: 'Furniture repair, fitting and woodwork.',
    serviceTypes: ['Furniture Repair', 'Woodwork'],
    isActive: true,
  },
  {
    name: 'Painter',
    description: 'Wall paint, polish and home painting service.',
    serviceTypes: ['Painting Service', 'Wall Paint'],
    isActive: true,
  },
  {
    name: 'AC Repair',
    description: 'AC servicing, gas refill and cooling issues.',
    serviceTypes: ['AC Service', 'Cooling Repair'],
    isActive: true,
  },
  {
    name: 'Cleaning',
    description: 'Home cleaning and deep cleaning services.',
    serviceTypes: ['Home Cleaning', 'Deep Cleaning'],
    isActive: true,
  },
  {
    name: 'Pandit Ji',
    description: 'Puja, path and sanskar services.',
    serviceTypes: ['Puja', 'Path', 'Sanskar'],
    isActive: true,
  },
  {
    name: 'Event Management',
    description: 'Decor, tent and event planning support.',
    serviceTypes: ['Event', 'Tent', 'Decoration'],
    isActive: true,
  },
];

const listPublicCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryConfig.find({ isActive: true }).sort('name');
  res.json({ categories: categories.length ? categories : defaultCategories });
});

module.exports = { listPublicCategories };
