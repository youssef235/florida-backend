import { request } from './api.js';
import { state } from './state.js';

export const loadUsers = async () => {
  const res = await request('/admin/users');
  state.users = res.data || [];
  renderUsers();
};

export const renderUsers = () => {
  const el = document.getElementById('users-list');
  el.innerHTML = '';

  state.users.forEach((u) => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <div class="card-body">
        <h3>${u.firstName} ${u.lastName}</h3>
        <p>${u.email}</p>
      </div>
    `;

    el.appendChild(div);
  });
};