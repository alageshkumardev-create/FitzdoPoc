// Token management utilities

export const getToken = () => {
  return localStorage.getItem('fitzdo_token');
};

export const setToken = (token) => {
  localStorage.setItem('fitzdo_token', token);
};

export const clearToken = () => {
  localStorage.removeItem('fitzdo_token');
};
