import axios from '@/axiosInstance';

const handleError = (error, defaultMessage) => {
  throw new Error(error.response?.data?.message || defaultMessage);
};

export const EquiposService = {
  async getAllEquipos() {
    try {
      const response = await axios.get('/Equipos');
      return response.data;
    } catch (error) {
      handleError(error, "Ocurrió un error al obtener los equipos");
    }
  },

  async agregarEquipo(datos) {
    if (!datos || typeof datos !== 'object') {
      throw new Error("Los datos para crear un equipo son inválidos.");
    }
    try {
      const response = await axios.post('/Equipos', datos);
      return response.data;
    } catch (error) {
      handleError(error, "Ocurrió un error al crear el equipo");
    }
  },

  async actualizarEquipo(id, datos) {
    if (!id || !datos || typeof datos !== 'object') {
      throw new Error("ID o datos inválidos para actualizar el equipo.");
    }
    try {
      const response = await axios.put(`/Equipos/${id}`, datos);
      return response.data;
    } catch (error) {
      handleError(error, "Ocurrió un error al actualizar el equipo");
    }
  },

  async eliminarEquipo(id) {
    if (!id) {
      throw new Error("ID inválido para eliminar el equipo.");
    }
    try {
      const response = await axios.delete(`/Equipos/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, "Ocurrió un error al eliminar el equipo");
    }
  },
};
