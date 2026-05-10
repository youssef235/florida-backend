import { request } from './api.js';
import { state } from './state.js';

const ORDER_STATUS = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Processing' },
  { value: 2, label: 'Shipped' },
  { value: 3, label: 'Delivered' },
  { value: 4, label: 'Cancelled' },
];

export const loadOrders = async () => {
  const res = await request('/admin/orders');
  state.orders = res.data || [];
  renderOrders();
};

export const renderOrders = () => {
  const el = document.getElementById('orders-list');
  el.innerHTML = '';

  state.orders.forEach((o) => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <div class="card-body">
        <h3>Order #${o._id}</h3>
        <p>${o.user?.email || ''}</p>

        <select onchange="window.updateOrderStatus('${o._id}', this.value)">
          ${ORDER_STATUS.map(
            s => `
              <option value="${s.value}" ${s.value === o.orderStatus ? 'selected' : ''}>
                ${s.label}
              </option>
            `
          ).join('')}
        </select>
      </div>
    `;

    el.appendChild(div);
  });
};