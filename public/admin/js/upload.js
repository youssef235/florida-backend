export let selectedImages = [];
export let selectedCategoryImage = null;
 
export const handleProductImages = (e, previewEl) => {
  selectedImages = [...e.target.files];
 
  if (!previewEl) return;
  previewEl.innerHTML = '';
 
  selectedImages.forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = `<img src="${ev.target.result}" />`;
      previewEl.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
};
 
export const handleCategoryImage = (e, previewEl) => {
  const file = e.target.files[0];
  if (!file) return;
 
  selectedCategoryImage = file;
 
  if (!previewEl) return;
 
  const reader = new FileReader();
  reader.onload = (ev) => {
    previewEl.innerHTML = `
      <div class="preview-item">
        <img src="${ev.target.result}" />
      </div>
    `;
  };
  reader.readAsDataURL(file);
};
 
export const resetImages = () => {
  selectedImages = [];
  selectedCategoryImage = null;
};
 