// product-form.js
export let selectedSizes = [];
export let selectedColors = [];
export let priceRows = [];

// ====================== إعادة تهيئة النموذج ======================
export const resetProductForm = () => {
  selectedSizes = [];
  selectedColors = [];
  priceRows = [];

  const form = document.getElementById('product-form');
  if (form) form.reset();

  document.getElementById('sizes-input') && (document.getElementById('sizes-input').innerHTML = '');
  document.getElementById('colors-preview') && (document.getElementById('colors-preview').innerHTML = '');
  document.getElementById('price-tags-container') && (document.getElementById('price-tags-container').innerHTML = '');
  document.getElementById('image-preview') && (document.getElementById('image-preview').innerHTML = '');

  // إعادة أزرار المقاسات السريعة
  document.querySelectorAll('.quick-select button').forEach(btn => {
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    btn.classList.remove('selected');
  });

  const title = document.getElementById('modal-title');
  if (title) title.textContent = 'إضافة منتج جديد';
};

// ====================== المقاسات ======================
window.addCommonSize = (size) => {
  if (!selectedSizes.includes(size)) {
    selectedSizes.push(size);
    renderSizes();

    // تغيير مظهر الزر
    document.querySelectorAll('.quick-select button').forEach(btn => {
      if (btn.textContent.trim() === size) {
        btn.classList.add('selected');
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
      }
    });
  }
};

const renderSizes = () => {
  const container = document.getElementById('sizes-input');
  if (!container) return;

  container.innerHTML = selectedSizes.map(size => `
    <div class="chip">
      <span>${size}</span>
      <span onclick="removeSize('${size}')" class="remove-btn">×</span>
    </div>
  `).join('');
};

window.removeSize = (size) => {
  selectedSizes = selectedSizes.filter(s => s !== size);
  renderSizes();

  // إعادة الزر لحالته
  document.querySelectorAll('.quick-select button').forEach(btn => {
    if (btn.textContent.trim() === size) {
      btn.classList.remove('selected');
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
  });
};

// ====================== الألوان ======================
window.addColor = () => {
  const nameInput = document.getElementById('color-name');
  const hexInput = document.getElementById('color-hex');
  if (!nameInput || !hexInput) return;

  const name = nameInput.value.trim();
  const hex = hexInput.value;

  if (!name) {
    nameInput.focus();
    return;
  }

  const exists = selectedColors.some(c => c.hex === hex);
  if (!exists) {
    selectedColors.push({ name, hex });
    renderColors();
    nameInput.value = '';
    hexInput.value = '#29c7ac';
  }
};

const renderColors = () => {
  const container = document.getElementById('colors-preview');
  if (!container) return;

  container.innerHTML = selectedColors.map((color, index) => `
    <div class="chip color-chip">
      <span class="color-dot" style="background-color:${color.hex}; width:15px; height:15px; border-radius:50%; display:inline-block; border:1px solid rgba(0,0,0,0.15);"></span>
      <span>${color.name}</span>
      <span onclick="removeColor(${index})" class="remove-btn">×</span>
    </div>
  `).join('');
};

window.removeColor = (index) => {
  selectedColors.splice(index, 1);
  renderColors();
};

// ====================== الأسعار ======================
export const addPriceRow = (name = '', price = '') => {
  const id = 'price-' + Date.now();
  const container = document.getElementById('price-tags-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'price-row';
  row.dataset.id = id;
  row.innerHTML = `
    <input type="text" placeholder="اسم النوع (مثال: أبيض)" value="${name}" />
    <input type="number" placeholder="السعر" value="${price}" min="0" />
    <button type="button" onclick="removePriceRow('${id}')" class="remove-price">×</button>
  `;

  container.appendChild(row);
  priceRows.push({ id, name, price });
};

// تعريف عالمي لاستخدامه في HTML
window.addPriceRow = addPriceRow;

window.removePriceRow = (id) => {
  const row = document.querySelector(`.price-row[data-id="${id}"]`);
  if (row) row.remove();
  priceRows = priceRows.filter(item => item.id !== id);
};

export const getPriceTags = () => {
  const rows = document.querySelectorAll('.price-row');
  const tags = [];

  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const name = inputs[0]?.value.trim();
    const price = Number(inputs[1]?.value) || 0;
    if (name) tags.push({ name, price });
  });

  return tags;
};

// ====================== تحميل المنتج للتعديل ======================
export const loadProductForEdit = (product) => {
  const title = document.getElementById('modal-title');
  if (title) title.textContent = 'تعديل المنتج';

  const form = document.getElementById('product-form');
  if (!form) return;

  form.querySelector('[name="productId"]').value = product._id || product.id || '';
  form.querySelector('[name="name"]').value = product.name || '';
  form.querySelector('[name="description"]').value = product.description || '';
  form.querySelector('[name="season"]').value = product.season || 'summer';
  form.querySelector('[name="isFeatured"]').checked = !!product.isFeatured;

  // الفئات
  const categoryId = product.category?._id || product.category?.id || product.category;
  if (categoryId) {
    const checkbox = document.querySelector(`#product-categories input[value="${categoryId}"]`);
    if (checkbox) checkbox.checked = true;
  }

  // المقاسات
  selectedSizes = Array.isArray(product.sizes) ? [...product.sizes] : [];
  renderSizes();

  // تحديث أزرار المقاسات السريعة
  selectedSizes.forEach(size => {
    document.querySelectorAll('.quick-select button').forEach(btn => {
      if (btn.textContent.trim() === size) {
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
        btn.classList.add('selected');
      }
    });
  });

  // الألوان
  selectedColors = Array.isArray(product.colors) ? [...product.colors] : [];
  renderColors();

  // الأسعار
  const priceContainer = document.getElementById('price-tags-container');
  if (priceContainer) priceContainer.innerHTML = '';
  priceRows = [];

  if (Array.isArray(product.priceTags) && product.priceTags.length > 0) {
    product.priceTags.forEach(tag => addPriceRow(tag.name || '', tag.price || ''));
  } else {
    addPriceRow();
  }

  // الصور الحالية
  const preview = document.getElementById('image-preview');
  if (preview && Array.isArray(product.images) && product.images.length > 0) {
    preview.innerHTML = product.images.map(src => `
      <div class="preview-item">
        <img src="${src}" onerror="this.style.display='none'" />
      </div>
    `).join('');
  }
};

// ====================== استخراج Payload ======================
export const getProductPayload = (form) => {
  const fd = new FormData(form);

  return {
    name: fd.get('name'),
    description: fd.get('description'),
    season: fd.get('season'),
    isFeatured: fd.get('isFeatured') === 'on',
    sizes: selectedSizes,
    colors: selectedColors,
    priceTags: getPriceTags(),
  };
};