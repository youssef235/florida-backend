async function loadPartial(containerId, filePath) {
  const response = await fetch(filePath);

  const html = await response.text();

  document.getElementById(containerId).innerHTML = html;
}

window.addEventListener("DOMContentLoaded", async () => {

  await loadPartial(
    "sidebar-container",
    "./partials/sidebar.html"
  );

  await loadPartial(
    "topbar-container",
    "./partials/topbar.html"
  );

  await loadPartial(
    "dashboard-container",
    "./partials/dashboard.html"
  );

  await loadPartial(
    "products-container",
    "./partials/products.html"
  );

  await loadPartial(
    "categories-container",
    "./partials/categories.html"
  );

  await loadPartial(
    "orders-container",
    "./partials/orders.html"
  );

  await loadPartial(
    "users-container",
    "./partials/users.html"
  );

  await loadPartial(
    "product-modal-container",
    "./partials/modals/product-modal.html"
  );

  await loadPartial(
    "category-modal-container",
    "./partials/modals/category-modal.html"
  );

});