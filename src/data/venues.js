import { format } from 'date-fns';

const STORAGE_KEY = 'futsal_bookings';

export const VENUES = [
  {
    id: 'v1',
    name: 'Champion Futsal Arena',
    location: 'Depok, Sleman',
    type: 'Sintetis',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    courts: [
      { courtId: 'v1A', label: 'Lapangan A', price: 120000 },
      { courtId: 'v1B', label: 'Lapangan B', price: 115000 }
    ],
    slots: ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
  },
  {
    id: 'v2',
    name: 'Victory Futsal Center',
    location: 'Umbulharjo, Kota Yogyakarta',
    type: 'Vinyl',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    courts: [
      { courtId: 'v2A', label: 'Lapangan A', price: 135000 },
      { courtId: 'v2B', label: 'Lapangan B', price: 130000 }
    ],
    slots: ['15:00', '16:00', '18:00', '19:00', '20:00', '22:00']
  },
  {
    id: 'v3',
    name: 'Garuda Sport Futsal',
    location: 'Bantul',
    type: 'Sintetis',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    courts: [
      { courtId: 'v3A', label: 'Lapangan A', price: 105000 },
      { courtId: 'v3B', label: 'Lapangan B', price: 100000 }
    ],
    slots: ['15:00', '16:00', '17:00', '18:00', '19:00']
  }
];

export function getStoredBookings() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch (error) {
    return [];
  }
}

export function saveBookings(bookings = []) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function getBookingEntriesForCourt(courtId, date) {
  const all = getStoredBookings();
  return all.filter((booking) => booking.courtId === courtId && booking.date === date);
}

export function isSlotBooked(courtId, date, slot) {
  return getBookingEntriesForCourt(courtId, date).some((entry) => entry.slot === slot);
}

export function getVenueById(id) {
  return VENUES.find((venue) => venue.id === id);
}

export function getVenueAvailability(venue, date) {
  return venue.slots.map((slot) => {
    const availableCourts = venue.courts.filter((court) => !isSlotBooked(court.courtId, date, slot));
    return {
      slot,
      availableCourts,
      isAvailable: availableCourts.length > 0,
      firstAvailableCourt: availableCourts[0] || null
    };
  });
}

export function getVenueSummary(venue, date) {
  const availability = getVenueAvailability(venue, date);
  const availableSlots = availability.filter((slotData) => slotData.isAvailable).map((slotData) => slotData.slot);
  const firstOpenSlot = availability.find((slotData) => slotData.isAvailable);

  return {
    availableSlots,
    openSlotCount: availableSlots.length,
    firstOpenSlot: firstOpenSlot?.slot || null,
    firstAvailableCourt: firstOpenSlot?.firstAvailableCourt || null,
  };
}

export function findFirstAvailableCourt(venue, date, slot) {
  const slotInfo = getVenueAvailability(venue, date).find((item) => item.slot === slot);
  return slotInfo?.firstAvailableCourt || null;
}

export function recommendOtherVenues(currentVenueId, date, slot) {
  return VENUES.filter((venue) => {
    if (venue.id === currentVenueId) return false;
    const slotInfo = getVenueAvailability(venue, date).find((item) => item.slot === slot);
    return slotInfo?.isAvailable;
  });
}

export function getAllBookings() {
  return getStoredBookings();
}

export function getBookingsByUser(userEmail) {
  const bookings = getAllBookings();
  return bookings.filter((booking) => booking.userEmail === userEmail);
}

export function getBookingStats(filterDate) {
  const bookings = getAllBookings();
  const filtered = filterDate ? bookings.filter((booking) => booking.date === filterDate) : bookings;
  const totalRevenue = filtered.reduce((sum, booking) => sum + (booking.total ?? 0), 0);
  const uniqueUsers = new Set(filtered.map((booking) => booking.userEmail)).size;
  const totalAvailableSlots = VENUES.reduce((total, venue) => total + venue.slots.length * venue.courts.length, 0);
  const occupancyRate = totalAvailableSlots ? Math.round((filtered.length / totalAvailableSlots) * 100) : 0;

  return {
    totalRevenue,
    bookingCount: filtered.length,
    activeUsers: uniqueUsers,
    occupancyRate,
  };
}

export function bookSlot(venue, courtId, date, slot, userEmail) {
  const bookings = getStoredBookings();
  const court = venue.courts.find((courtItem) => courtItem.courtId === courtId);
  const price = court?.price ?? 0;
  const bookingId = `BK-${Date.now()}`;
  const total = price + 5000 + 10000;

  bookings.push({
    id: bookingId,
    venueId: venue.id,
    venueName: venue.name,
    venueLocation: venue.location,
    courtId,
    courtLabel: court?.label || '',
    price,
    total,
    date,
    slot,
    userEmail,
    createdAt: new Date().toISOString(),
  });
  saveBookings(bookings);
  return bookingId;
}

export function normalizeDate(date) {
  return format(date instanceof Date ? date : new Date(date), 'yyyy-MM-dd');
}
