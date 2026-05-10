// products.js
import { state } from './state.js';
import { request } from './api.js';
import { selectedImages } from './upload.js';
import { getProductPayload } from './product-form.js';
import { openModal } from './app.js';
import { loadProductForEdit, resetProductForm } from './product-form.js';

// ==================== Configuration ====================
const BASE_URL = 'http://localhost:4000';

// ====================== تحميل المنتجات ======================
export const loadProducts = async () => {
  try {
    const res = await request('/admin/products');
    state.products = res.data || [];
    
    console.log(`✅ Loaded ${state.products.length} products successfully`);
    renderProducts();
  } catch (err) {
    console.error('❌ Error loading products:', err);
  }
};

// ====================== عرض المنتجات ======================
export const renderProducts = () => {
  const el = document.getElementById('products-list');
  if (!el) {
    console.warn('⚠️ products-list element not found');
    return;
  }

  el.innerHTML = '';

  if (state.products.length === 0) {
    el.innerHTML = '<p class="empty-msg">لا توجد منتجات بعد.</p>';
    return;
  }

  state.products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'card';

    // معالجة الصورة
    const imgSrc = Array.isArray(p.images) && p.images.length > 0 
      ? BASE_URL + p.images[0] 
      : null;

    const productId = p._id || p.id;

    div.innerHTML = `
      ${imgSrc 
        ? `<img class="product-image" src="${imgSrc}" 
               onerror="this.style.display='none'" />` 
        : '<div class="no-image"><i class="fa-solid fa-box-open"></i></div>'
      }
      
      <div class="card-body">
        <h3>${p.name || 'بدون اسم'}</h3>
        <p class="product-desc">
          ${p.description ? p.description.substring(0, 80) + '...' : 'لا يوجد وصف'}
        </p>
        
        <div class="card-actions">
          <button class="edit-btn" onclick="editProduct('${productId}')">
            تعديل
          </button>
          <button class="delete-btn" onclick="deleteProduct('${productId}')">
            حذف
          </button>
        </div>
      </div>
    `;

    el.appendChild(div);
  });
};

// ====================== تعديل المنتج ======================
window.editProduct = async (id) => {
  const product = state.products.find(p => (p._id || p.id) === id);
  if (!product) {
    console.error('Product not found with id:', id);
    return;
  }

  resetProductForm();
  openModal('product-modal');
  loadProductForEdit(product);
};

// ====================== حذف المنتج ======================
window.deleteProduct = async (id) => {
  if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

  try {
    await request(`/admin/products/${id}`, { method: 'DELETE' });
    console.log('✅ Product deleted successfully');
    loadProducts(); // إعادة تحميل المنتجات
  } catch (err) {
    console.error('Delete error:', err);
    alert('حدث خطأ أثناء الحذف: ' + (err.message || err));
  }
};

// ====================== إرسال المنتج (إضافة / تعديل) ======================
export const submitProduct = async (form, productCategories, onDone) => {
  try {
    const payload = getProductPayload(form);
    
    if (productCategories && productCategories.length > 0) {
      payload.categories = productCategories;
    }

    const id = form.querySelector('[name="productId"]').value;
    let product;

    if (id) {
      // تعديل منتج موجود
      product = await request(`/admin/products/${id}`, { 
        method: 'PUT', 
        body: payload 
      });
    } else {
      // إضافة منتج جديد
      product = await request('/admin/products', { 
        method: 'POST', 
        body: payload 
      });
    }

    const productId = product?.data?._id || product?.data?.id || product?._id || product?.id;

    // رفع الصور بعد الحفظ
    if (selectedImages.length > 0 && productId) {
      const imagesForm = new FormData();
      selectedImages.forEach(img => imagesForm.append('images', img));

      await request(`/admin/products/${productId}/upload-images`, {
        method: 'POST',
        body: imagesForm,
      });
    }

    if (onDone) onDone();
    loadProducts(); // تحديث القائمة

    console.log('✅ Product saved successfully');
  } catch (err) {
    console.error('Submit product error:', err);
    alert('حدث خطأ أثناء حفظ المنتج: ' + (err.message || err));
  }
};