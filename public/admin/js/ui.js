export const showToast = (message, error = false) => {
  const toast = document.getElementById('toast');

  toast.textContent = message;
  toast.style.background = error ? '#ff5d5d' : '#121212';
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
};

export const openModal = (id) => {
  document.getElementById(id).classList.remove('hidden');
};

export const closeModal = (id) => {
  document.getElementById(id).classList.add('hidden');
};