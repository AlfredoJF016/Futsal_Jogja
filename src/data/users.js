const STORAGE_USERS = 'futsal_users';

const DEFAULT_USERS = [
  { id: 'USR-001', name: 'John Doe', email: 'john@example.com', joinDate: '12 Jan 2026', totalBookings: 12, activeBookings: 1, status: 'aktif', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff' },
  { id: 'USR-002', name: 'Budi Santoso', email: 'budi@santoso.id', joinDate: '24 Feb 2026', totalBookings: 8, activeBookings: 0, status: 'aktif', avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=10b981&color=fff' },
  { id: 'USR-003', name: 'Citra Kirana', email: 'citra@mail.com', joinDate: '02 Mar 2026', totalBookings: 3, activeBookings: 1, status: 'Nonaktif', avatar: 'https://ui-avatars.com/api/?name=Citra+Kirana&background=f59e0b&color=fff' },
  { id: 'USR-004', name: 'Dimas Anggara', email: 'dimas@anggara.net', joinDate: '18 Apr 2026', totalBookings: 0, activeBookings: 0, status: 'diblokir', avatar: 'https://ui-avatars.com/api/?name=Dimas+Anggara&background=ef4444&color=fff' },
  { id: 'USR-005', name: 'Eka Saputra', email: 'eka.saputra@outlook.com', joinDate: '05 Mei 2026', totalBookings: 15, activeBookings: 2, status: 'aktif', avatar: 'https://ui-avatars.com/api/?name=Eka+Saputra&background=8b5cf6&color=fff' },
];

export function getStoredUsers() {
  if (typeof window === 'undefined') return DEFAULT_USERS.map(u => ({ ...u, password: 'user123' }));
  try {
    const stored = localStorage.getItem(STORAGE_USERS);
    if (!stored) {
      const defaultWithPwd = DEFAULT_USERS.map(u => ({ ...u, password: 'user123' }));
      localStorage.setItem(STORAGE_USERS, JSON.stringify(defaultWithPwd));
      return defaultWithPwd;
    }
    const parsed = JSON.parse(stored);
    let modified = false;
    const synced = parsed.map(u => {
      if (!u.password) {
        u.password = 'user123';
        modified = true;
      }
      return u;
    });
    if (modified) {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(synced));
    }
    return synced;
  } catch (e) {
    return DEFAULT_USERS.map(u => ({ ...u, password: 'user123' }));
  }
}

export function saveUsers(users = []) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

export function updateUserStatus(userId, status) {
  const users = getStoredUsers().map(u => u.id === userId ? { ...u, status } : u);
  saveUsers(users);
  return users;
}

export function deleteUser(userId) {
  const users = getStoredUsers().filter(u => u.id !== userId);
  saveUsers(users);
  return users;
}

export function registerUser(name, email, password = 'user123') {
  const users = getStoredUsers();
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return exists;
  
  const newUser = {
    id: `USR-${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    joinDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    totalBookings: 0,
    activeBookings: 0,
    status: 'aktif',
    password: password.trim(),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d9488&color=fff`
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}
