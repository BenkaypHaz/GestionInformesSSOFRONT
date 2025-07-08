<script>
import { InformeCalorService } from '@/services/InformeCalor';

export default {
  name: "CustomTable",
  components: {

  },
  emits: ['tasa-cambiada'],
  data() {
    return {
      pesoPromedio: "", // Para almacenar el peso promedio ingresado
      adaptacionSeleccionada: "", // Para almacenar la selección del dropdown
      actividadSeleccionadaId: "",
      tasasMetabolicas: [], 
    };
  },
  computed: {
  actividadSeleccionada() {
    return this.tasasMetabolicas.find(t => t.id === this.actividadSeleccionadaId);
  }
},watch: {
  actividadSeleccionadaId() {
    const seleccionada = this.actividadSeleccionada
    if (seleccionada) {
      
      this.$emit('tasa-cambiada', seleccionada.tasaMetabolicaMax)
    }
  }
},
async mounted() {
  try {
    const response = await InformeCalorService.obtenerTasasMetabolicas();
    this.tasasMetabolicas = response.data; 
  } catch (error) {
    console.error("No se pudo cargar tasas metabólicas", error);
  }
},
  methods: {
    validateWeight() {
      // Validar que el input solo acepte números con hasta dos decimales
      const regex = /^\d*(\.\d{0,2})?$/;
      if (!regex.test(this.pesoPromedio)) {
        this.pesoPromedio = this.pesoPromedio.slice(0, -1); // Remover carácter inválido
      }
    },
  },
};

</script>

<template>
  <div class="custom-table">
    <table>
      <thead>
        <tr>
          <th>FACTOR</th>
          <th>PARÁMETROS</th>
          <th>CRITERIO CONSIDERADO</th>
        </tr>
      </thead>
      <tbody>
       <!--   <tr>
          <td>Tiempo de Exposición</td>
          <td>
            <TimeSlider />
          </td>
          <td>
            Variará de acuerdo al tipo de trabajo enlistado en una tabla de referencia.
          </td>
        </tr>      
            -->
        <tr>
  <td>Tasa Metabólica</td>
  <td>
    <select v-model="actividadSeleccionadaId" class="dropdown">
<option
  v-for="tasa in tasasMetabolicas"
  :key="tasa.id"
  :value="tasa.id"
>
  {{ tasa.actividad }} - Rango: {{ tasa.tasaMetabolicaMin }}–{{ tasa.tasaMetabolicaMax || '+' }} W/m²
</option>

</select>



  </td>
  <td>
    Breve descripción de la(s) tarea(s) realizada(s).
  </td>
</tr>

        <tr>
          <td>Adaptación fisiológica al calor</td>
          <td>
            <!-- Dropdown para selección de aclimatación -->    
            <select v-model="adaptacionSeleccionada" class="dropdown">
              <option value="Aclimatado">Aclimatado</option>
              <option value="No Aclimatado">No Aclimatado</option> 
            </select>
          </td>
          <td>
            Dependerá de la selección de un parámetro en una tabla   da.
          </td>  
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.center-text {
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination button {
  margin: 0 5px;
}

.pagination .active {
  font-weight: bold;
  text-decoration: underline;
}

.time-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100px; /* Reducir el ancho del slider */
  margin: 0 auto;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.input-container span {
  font-weight: bold;
}

.input-container input {
  width: 90px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  color: #fff; /* Cambia el color del texto aquí */
  background-color: #181c2c/* Cambia el color de fondo si es necesario */
}

.dropdown {
  width: 130px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #181c2c;
  font-size: 14px;
  color: white;
}
</style>
