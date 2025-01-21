import axios from '@/axiosInstance';

export const userService = {
  async getAllUsers() {
    try {
      const response = await axios.get('/Usuario'); 
        return response.data 
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw new Error(error.response?.data?.message || "Ocurrió un error");
    }
  },
  async addUser(userData) {
    try {
      const response = await axios.post('/Usuario', userData);
      return response.data;
    } catch (error) {
        console.error("Ocurrio un error de API:", error.response ? error.response.data : error);
      throw new Error(error.response.data.message || "Un error ocurrio");
    }
  },
  async updateUsuario(id, payload) {
    try {
      const response = await axios.put(`/Usuario/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async loginUser(credentials) {
    try {
      const response = await axios.post('/Usuario/authenticate', credentials);
      return response.data; 
    } catch (error) {
      throw new Error(error.response.data.message || "Fallo al iniciar sesion");
    }
  },
  async getNotificacionesUsuario(id) {
    try {
      const response = await axios.get(`/Notificaciones/${id}`);
      return response.data; 
    } catch (error) {
      throw new Error(error.response.data.message || "Ocurrio un error obteniendo las notificaciones");
    }
  },
  async getRoles() {
    try {
      const response = await axios.get(`/Usuario/GetRoles`);
      return response.data; 
    } catch (error) {
      throw new Error(error.response.data.message || "Ocurrio un error obteniendo los roles");
    }
  },
  async getDepartamentos() {
    try {
      const response = await axios.get(`/Departamentos`);
      return response.data; 
    } catch (error) {
      throw new Error(error.response.data.message || "Ocurrio un error obteniendo los departamentos");
    }
  },
  async getUsuarioPresupuestos() {
    try {
      const response = await axios.get(`/Departamentos`);
      return response.data; 
    } catch (error) {
      throw new Error(error.response.data.message || "Ocurrio un error obteniendo los departamentos");
    }
  },
  async marcarNotificacionesLeidas(ids) {
    try {
      const response = await axios.post('/Notificaciones/marcarLeidas',ids);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || "Error marking notifications as read");
    }
  },
  async changePassword(userId, payload) {
    try {
      const response = await axios.put(`/Usuario/${userId}/change-password`, payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred while changing the password.');
    }
  },
};
