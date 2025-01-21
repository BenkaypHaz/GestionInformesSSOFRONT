import axios from '@/axiosInstance';

export const InformeCalorService = {

  async crearInforme(data) {
    try {
      const response = await axios.post('/InformesCalor', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear el informe');
    }
  },
  

  async subirArchivoExcel(formData) {
    try {
      const response = await axios.post('/Excel/LeerExcel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      throw new Error(error.response?.data?.message || 'Error al subir el archivo');
    }
  },
  async obtenerInformes() {
    try {
      const response = await axios.get('/informe-calor');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ocurrió un error al obtener los informes');
    }
  },

  async obtenerInformePorId(id) {
    try {
      const response = await axios.get(`/informe-calor/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ocurrió un error al obtener el informe');
    }
  },

  async eliminarInforme(id) {
    try {
      const response = await axios.delete(`/informe-calor/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ocurrió un error al eliminar el informe');
    }
  },
  async descargarInformePDF(informeId) {
    try {
        const response = await axios.get(`/Report/PresupuestoGeneral`, {
            params: { informeId },
            responseType: 'blob', 
        });
        return response.data;
    } catch (error) {
        console.error('Error al descargar el informe PDF:', error);
        throw new Error(error.response?.data?.message || 'Error al descargar el informe');
    }
},
async getRopaUtilizada() {
  try {
    const response = await axios.get('/RopaUtilizada');
    return response.data;
  } catch (error) {
    console.error('Error fetching Ropa Utilizada:', error);
    throw error;
  }
},

};
