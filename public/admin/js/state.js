export const state = {
  token: localStorage.getItem('admin_token'),
 
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user'));
    } catch {
      return null;
    }
  })(),
 
  products: [],
  categories: [],
  orders: [],
  users: [],
};
 