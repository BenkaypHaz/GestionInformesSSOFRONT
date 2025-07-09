import axios from '@/axiosInstance';
import axiosInstanceSAC  from '@/axiosInstanceSAC';

export const empresasService = {

  async getAllEmpresas() {
    try {
      const response = await axios.get('/Empresas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Ocurrió un error al obtener las empresas");
    }
  },

  async getAllEmpresasSac() {
    try {
      const response = await axiosInstanceSAC.get('/Empresas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Ocurrió un error al obtener las empresas");
    }
  },

  async agregarEmpresa(datos) {
    try {
      const response = await axios.post('/Empresas', datos);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Ocurrió un error al crear la empresa");
    }
  },

  async actualizarEmpresa(id, datos) {
    try {
      const response = await axios.put(`/Empresas/${id}`, datos);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Ocurrió un error al actualizar la empresa");
    }
  },

  async eliminarEmpresa(id) {
    try {
      const response = await axios.delete(`/Empresas/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Ocurrió un error al eliminar la empresa");
    }
  }
};
