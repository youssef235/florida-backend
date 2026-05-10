// categories.js
import { request } from './api.js';
import { state } from './state.js';
const BASE_URL = 'http://localhost:4000';

export const loadCategories = async () => {
  const res = await request('/admin/categories');
  state.categories = res.data || [];
  renderCategories();
  renderCategoryChips();
};

export const renderCategories = () => {
  const el = document.getElementById('categories-list');
  if (!el) return; // الحماية من null

  el.innerHTML = '';

  if (state.categories.length === 0) {
    el.innerHTML = '<p class="empty-msg">لا توجد فئات بعد.</p>';
    return;
  }

  state.categories.forEach((c) => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      ${c.image ? `<img class="product-image" src="${BASE_URL + c.image}"
 onerror="this.style.display='none'" />` : '<div class="no-image"><i class="fa-solid fa-image"></i></div>'}
      <div class="card-body">
        <h3>${c.name || 'بدون اسم'}</h3>
        <div class="card-actions">
          <button class="edit-btn" onclick="editCategory('${c._id || c.id}')">تعديل</button>
          <button class="delete-btn" onclick="deleteCategory('${c._id || c.id}')">حذف</button>
        </div>
      </div>
    `;

    el.appendChild(div);
  });
};

export const renderCategoryChips = () => {
  const el = document.getElementById('product-categories');
  if (!el) return; // الحماية من null

  el.innerHTML = '';

  state.categories.forEach((c) => {
    const label = document.createElement('label');
    label.className = 'chip';

    label.innerHTML = `
      <input type="checkbox" value="${c._id || c.id}" />
      ${c.name}
    `;

    el.appendChild(label);
  });
};

// ====================== تعديل وحذف الفئة ======================
window.editCategory = (id) => {
  const category = state.categories.find(c => (c._id || c.id) === id);
  if (!category) return;

  const form = document.getElementById('category-form');
  if (!form) return;

  form.querySelector('[name="categoryId"]').value = id;
  form.querySelector('[name="name"]').value = category.name || '';

  // عرض الصورة الحالية
  const preview = document.getElementById('category-preview');
  if (preview && category.image) {
    preview.innerHTML = `
      <div class="preview-item">
        <img src="${BASE_URL + category.image}" onerror="this.style.display='none'" />
      </div>
    `;
  }

  import('./app.js').then(({ openModal }) => openModal('category-modal'));
};

window.deleteCategory = async (id) => {
  if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;
  try {
    await request(`/admin/categories/${id}`, { method: 'DELETE' });
    loadCategories();
  } catch (err) {
    alert('حدث خطأ أثناء الحذف: ' + err.message);
  }
};