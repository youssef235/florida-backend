import { state } from './state.js';
 
const API = import.meta.env?.VITE_API_URL || 'http://localhost:4000';
 
export const request = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;
 
  const headers = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
  };
 
  const res = await fetch(API + url, {
    method: options.method || 'GET',
    headers,
    body: options.body
      ? isFormData
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });
 
  const data = await res.json().catch(() => null);
 
  if (!res.ok) {
    throw new Error(data?.message || `HTTP Error ${res.status}`);
  }
 
  return data;
};
 