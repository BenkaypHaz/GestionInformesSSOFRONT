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
  
async subirImagen(formData) {
      console.error('Si intente subir la imagen');

  try {
    const response = await axios.post('/Imagenes/Upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (error) {
    console.error('Error al subir imagen:', error)
    throw new Error(error.response?.data?.message || 'Error al subir imagen')
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
async obtenerTasasMetabolicas() {
  try {
    const response = await axios.get('/TasaMetabolica');
    return response.data; // ← porque estás usando ApiResponse
  } catch (error) {
    console.error('Error al obtener tasas metabólicas:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener tasas metabólicas');
  }
},

 async guardarValoresProyectados(data) {
    try {
      const response = await axios.post('/ValoresProyectados', data);
      return response.data;
    } catch (error) {
      console.error('Error al guardar valores proyectados:', error);
      throw new Error(error.response?.data?.message || 'Error al guardar los valores proyectados');
    }
  }

};
