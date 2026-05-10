// app.js
import { state } from './state.js';
import { loadCategories, renderCategories, renderCategoryChips } from './categories.js';
import { loadProducts, submitProduct } from './products.js';
import { resetProductForm, loadProductForEdit, addPriceRow } from './product-form.js';
import { handleProductImages, handleCategoryImage, selectedImages, selectedCategoryImage } from './upload.js';
import { request } from './api.js';
import { loadOrders } from './orders.js'; // تأكد من المسار
import { loadUsers } from './users.js'; 
import { loadSummary } from './summary.js';   // تأكد من المسار
  // تأكد من المسار
// ====================== تهيئة التطبيق ======================
const init = async () => {
  if (!state.token) {
    window.location.href = '/login.html';
    return;
  }

  console.log("🔄 Loading data...");

  try {
    await Promise.all([
      loadCategories(),
      loadProducts(),
loadOrders(), // 👈 أضف هذا
    loadUsers(),  // 👈 أضف هذا
    loadSummary()    ]);
    
    console.log("✅ Data loaded successfully");
    
    setupTabs();
    setupModals();
    setupForms();
    setupImageUploads();
    
  } catch (err) {
    console.error('Init error:', err);
  }
};

// ====================== التبويبات ======================
const setupTabs = () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
};

// ====================== المودالات ======================
export const openModal = (id) => {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
};

export const closeModal = (id) => {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
};

const setupModals = () => {
  // فتح مودال الفئة
  document.getElementById('open-category-modal')?.addEventListener('click', () => {
    openModal('category-modal');
  });

  // إغلاق مودال الفئة
  document.getElementById('close-category-modal')?.addEventListener('click', () => {
    closeModal('category-modal');
    document.getElementById('category-form')?.reset();
    const preview = document.getElementById('category-preview');
    if (preview) preview.innerHTML = '';
  });

  // فتح مودال المنتج
  document.getElementById('open-product-modal')?.addEventListener('click', () => {
    resetProductForm();
    openModal('product-modal');
    addPriceRow(); // سطر سعر افتراضي
  });

  // إغلاق مودال المنتج
  document.getElementById('close-product-modal')?.addEventListener('click', () => {
    closeModal('product-modal');
    resetProductForm();
  });

  // إغلاق بالضغط خارج المودال
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        resetProductForm();
      }
    });
  });
};

// ====================== النماذج ======================
const setupForms = () => {
  // نموذج الفئة
  document.getElementById('category-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form.querySelector('[name="categoryId"]').value;
    const name = form.querySelector('[name="name"]').value;

    try {
      if (id) {
        await request(`/admin/categories/${id}`, { method: 'PUT', body: { name } });
      } else {
        const category = await request('/admin/categories', { method: 'POST', body: { name } });

        // رفع الصورة إن وجدت
        if (selectedCategoryImage) {
          const fd = new FormData();
          fd.append('image', selectedCategoryImage);
          await request(`/admin/categories/${category.data?.id || category.id}/upload-image`, {
            method: 'POST',
            body: fd,
          });
        }
      }

      closeModal('category-modal');
      form.reset();
      const preview = document.getElementById('category-preview');
      if (preview) preview.innerHTML = '';
      loadCategories();
    } catch (err) {
      alert('حدث خطأ: ' + err.message);
    }
  });

  // نموذج المنتج
  document.getElementById('product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const productCategories = [...document.querySelectorAll('#product-categories input:checked')]
      .map(el => el.value);

    try {
      await submitProduct(form, productCategories, () => {
        closeModal('product-modal');
        resetProductForm();
      });
    } catch (err) {
      alert('حدث خطأ: ' + err.message);
    }
  });
};

// ====================== رفع الصور ======================
const setupImageUploads = () => {
  const productImagesInput = document.getElementById('product-images');
  const productPreview = document.getElementById('image-preview');
  if (productImagesInput && productPreview) {
    productImagesInput.addEventListener('change', (e) => {
      handleProductImages(e, productPreview);
    });
  }

  const categoryImageInput = document.getElementById('category-image');
  const categoryPreview = document.getElementById('category-preview');
  if (categoryImageInput && categoryPreview) {
    categoryImageInput.addEventListener('change', (e) => {
      handleCategoryImage(e, categoryPreview);
    });
  }
};

// ====================== تسجيل الخروج ======================
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  window.location.href = '/login.html';
});

// ====================== تشغيل التطبيق ======================

// إزالة الـ listener القديم
// document.addEventListener('DOMContentLoaded', init);   ← احذفه

// الطريقة الصحيحة الجديدة
window.addEventListener("DOMContentLoaded", async () => {

  // أولاً: تحميل كل الـ Partials
  await loadPartial("sidebar-container", "./partials/sidebar.html");
  await loadPartial("topbar-container", "./partials/topbar.html");
  await loadPartial("dashboard-container", "./partials/dashboard.html");
  await loadPartial("products-container", "./partials/products.html");
  await loadPartial("categories-container", "./partials/categories.html");
  await loadPartial("orders-container", "./partials/orders.html");
  await loadPartial("users-container", "./partials/users.html");
  await loadPartial("product-modal-container", "./partials/modals/product-modal.html");
  await loadPartial("category-modal-container", "./partials/modals/category-modal.html");

  console.log("✅ All partials loaded successfully");

  // بعد ما كل حاجة تحمل → نشغل init()
  await init();

  console.log("🚀 App fully initialized");
});

// دالة loadPartial (ضعها خارج أي listener)
async function loadPartial(containerId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    
    const html = await response.text();
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
    } else {
      console.warn(`Container not found: ${containerId}`);
    }
  } catch (err) {
    console.error(`Error loading ${filePath}:`, err);
  }
}