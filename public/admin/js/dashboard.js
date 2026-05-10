import { request } from './api.js';

export const loadSummary = async () => {
  const res = await request('/admin/summary');

  document.getElementById('stat-products').textContent = res.products || 0;
  document.getElementById('stat-categories').textContent = res.categories || 0;
  document.getElementById('stat-orders').textContent = res.orders || 0;
  document.getElementById('stat-users').textContent = res.users || 0;
};