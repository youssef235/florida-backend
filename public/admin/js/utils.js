export const parsePriceTags = (value = '') => {
  return value
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const [name, price] = line.split(':');
      return {
        name: name?.trim() || '',
        price: Number(price?.trim()) || 0,
      };
    })
    .filter(tag => tag.name);
};
 
export const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(price);
};
 