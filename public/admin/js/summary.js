export const loadSummary = async () => {
  try {
    const res = await request('/admin/summary');
    const data = res.data || res; // حسب شكل الـ Response من NestJS

    // تحديث الأرقام في الـ HTML
    if (document.getElementById('stat-products')) 
        document.getElementById('stat-products').innerText = data.productsCount || 0;
    if (document.getElementById('stat-categories')) 
        document.getElementById('stat-categories').innerText = data.categoriesCount || 0;
    if (document.getElementById('stat-orders')) 
        document.getElementById('stat-orders').innerText = data.ordersCount || 0;
    if (document.getElementById('stat-users')) 
        document.getElementById('stat-users').innerText = data.usersCount || 0;
  } catch (err) {
    console.error("Summary error:", err);
  }
};