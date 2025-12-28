
import { Booking, ServiceType, BookingStatus, Difficulty } from './types';

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    name: 'Ubud Cultural Discovery',
    type: ServiceType.TOUR,
    status: BookingStatus.ACTIVE,
    date: 'Oct 24, 2023',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    paidAmount: 120,
    onSiteAmount: 35,
    photos: [],
    driver: {
      name: 'Wayan Sudarsana',
      photo: 'https://images.unsplash.com/photo-1590424753858-394a127809a1?auto=format&fit=crop&w=200&h=200&q=80',
      plate: 'DK 1234 ABC',
      whatsapp: 'https://wa.me/628123456789',
      availability: 'Available'
    },
    pois: [
      { id: 'p1', name: 'Tegalalang Rice Terrace', isCompleted: true, arrivedAt: '09:15', completedAt: '10:30' },
      { id: 'p2', name: 'Tirta Empul Temple', isCompleted: false },
      { id: 'p3', name: 'Coffee Plantation', isCompleted: false },
      { id: 'p4', name: 'Lunch at Kintamani', isCompleted: false }
    ]
  },
  {
    id: 'b2',
    name: 'Ayung River Rafting',
    type: ServiceType.ACTIVITY,
    status: BookingStatus.UPCOMING,
    date: 'Oct 25, 2023',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
    paidAmount: 85,
    onSiteAmount: 10,
    photos: [],
    difficulty: Difficulty.MODERATE,
    healthWarning: 'Not recommended for those with severe heart conditions or back problems.',
    waiverSigned: false,
    gearList: [
      { id: 'g1', text: 'Wear swimsuit or shorts', isCompleted: false },
      { id: 'g2', text: 'Bring dry clothes', isCompleted: false },
      { id: 'g3', text: 'Apply waterproof sunscreen', isCompleted: false },
      { id: 'g4', text: 'Comfortable river sandals', isCompleted: false }
    ]
  },
  {
    id: 'b3',
    name: 'Bali Essentials 5-Day Explorer',
    type: ServiceType.PACKAGE,
    status: BookingStatus.UPCOMING,
    date: 'Oct 26 - Oct 30, 2023',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
    paidAmount: 850,
    onSiteAmount: 150,
    photos: [],
    currentDay: 1,
    totalDays: 5,
    packageInclusions: [
      { id: 'i1', text: 'Sunrise Yoga Session', isCompleted: false },
      { id: 'i2', text: 'Seafood Dinner at Jimbaran', isCompleted: false },
      { id: 'i3', text: 'Traditional Balinese Spa', isCompleted: false },
      { id: 'i4', text: 'Cooking Class in Ubud', isCompleted: false }
    ],
    transferTasks: [
      { id: 't1', text: 'Pick up from Airport (Day 1)', isCompleted: true },
      { id: 't2', text: 'Ubud Hotel Check-out (Day 3)', isCompleted: false },
      { id: 't3', text: 'Seminyak Villa Check-in (Day 3)', isCompleted: false }
    ]
  },
  {
    id: 'b4',
    name: 'Island Hopper Multi-Day Quest',
    type: ServiceType.PACKAGE,
    status: BookingStatus.ACTIVE,
    date: 'Nov 1 - Nov 4, 2024',
    image: 'https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&w=1200&q=80',
    paidAmount: 620,
    onSiteAmount: 100,
    photos: [],
    currentDay: 2,
    totalDays: 4,
    isOpenDay: true,
    openDayOptions: ['Nusa Penida Boat Tour', 'Mount Batur Sunrise Trek', 'Uluwatu Sunset Dance'],
    packageInclusions: [
      { id: 'i5', text: 'Beach Club Access', isCompleted: true },
    ],
    transferTasks: [
      { id: 't4', text: 'Sanur Pier Transfer', isCompleted: false }
    ]
  }
];

export const BALI_ORANGE = 'bg-orange-500';
export const BALI_BLUE = 'bg-sky-600';
export const SUCCESS_GREEN = 'bg-emerald-600';
