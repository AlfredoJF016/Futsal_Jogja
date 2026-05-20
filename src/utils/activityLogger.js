/**
 * Utility to log and retrieve admin activities in LocalStorage.
 * Logs are stored under the key 'admin_activities'.
 */

export function logAdminActivity(actionType, description) {
  if (typeof window === 'undefined') return;
  try {
    const authUser = JSON.parse(localStorage.getItem('authUser') || 'null');
    const adminEmail = authUser?.email || 'admin@jogjafutsal.com';
    const adminName = authUser?.name || 'Admin Jogja';

    const logs = JSON.parse(localStorage.getItem('admin_activities') || '[]');
    
    const newLog = {
      id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminName,
      adminEmail,
      actionType, // e.g. 'login', 'logout', 'confirm_booking', 'delete_booking', 'add_venue', 'edit_venue', 'delete_venue', 'block_user', 'unblock_user', 'delete_user', 'export_pdf'
      description,
      timestamp: new Date().toISOString()
    };

    logs.push(newLog);
    localStorage.setItem('admin_activities', JSON.stringify(logs));
    
    // Dispatch a custom event so other components in the same tab can react in real-time
    window.dispatchEvent(new Event('admin_activities_updated'));
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
}

export function getAdminActivities() {
  if (typeof window === 'undefined') return [];
  try {
    const logs = JSON.parse(localStorage.getItem('admin_activities') || '[]');
    // Sort by timestamp descending (newest first)
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    return [];
  }
}

export function clearAdminActivities() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('admin_activities');
    window.dispatchEvent(new Event('admin_activities_updated'));
  } catch (error) {
    console.error('Failed to clear admin activities:', error);
  }
}
