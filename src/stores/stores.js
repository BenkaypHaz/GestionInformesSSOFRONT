import { reactive } from 'vue';

const state = reactive({
  user: JSON.parse(localStorage.getItem('user')) || null,
  permissions: JSON.parse(localStorage.getItem('permissions')) || [],
});

const setUser = (userData) => {
  state.user = userData;
  localStorage.setItem('user', JSON.stringify(userData)); // Save to local storage
};

const setPermissions = (permissions) => {
  state.permissions = permissions;
  localStorage.setItem('permissions', JSON.stringify(permissions)); // Save to local storage
};

const hasPermission = (permission) => {
  return state.permissions.includes(permission);
};

const getUser = () => {
  return state.user;
};

export default {
  state,
  setUser,
  setPermissions,
  hasPermission,
  getUser,
};
