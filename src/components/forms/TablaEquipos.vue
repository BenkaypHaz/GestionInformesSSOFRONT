<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import BaseButton from '@/components/base/BaseButton.vue';
import { mdiPencil, mdiTrashCan } from '@mdi/js';

const props = defineProps({
  equiposSeleccionados: {
    type: Array,
    required: false,
    default: () => [], // Valor predeterminado vacío
  },
});

const selectedEquipo = ref({ id: null, label: '' });
const isModalActive = ref(false);

const perPage = ref(5);
const currentPage = ref(0);

// Validación al calcular itemsPaginated
const itemsPaginated = computed(() => 
  (Array.isArray(props.equiposSeleccionados) 
    ? props.equiposSeleccionados 
    : []).slice(
      perPage.value * currentPage.value, 
      perPage.value * (currentPage.value + 1)
    )
);

const numPages = computed(() => 
  Math.ceil((Array.isArray(props.equiposSeleccionados) 
    ? props.equiposSeleccionados.length 
    : 0) / perPage.value)
);

const currentPageHuman = computed(() => currentPage.value + 1);

const openEditModal = (equipo) => {
  selectedEquipo.value = { ...equipo };
  isModalActive.value = true;
};

const confirmDelete = (equipo) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `Estás a punto de eliminar el equipo: ${equipo.label}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: '#181c2c',
  }).then((result) => {
    if (result.isConfirmed) {
      removeEquipo(equipo.id);
    }
  });
};

const removeEquipo = (id) => {
  const index = props.equiposSeleccionados.findIndex((equipo) => equipo.id === id);
  if (index !== -1) {
    props.equiposSeleccionados.splice(index, 1);
    Swal.fire({
      title: 'Eliminado',
      text: 'El equipo ha sido eliminado de la lista.',
      icon: 'success',
      background: '#181c2c',
    });
  }
};

const saveEquipo = () => {
  const index = props.equiposSeleccionados.findIndex((equipo) => equipo.id === selectedEquipo.value.id);
  if (index !== -1) {
    props.equiposSeleccionados[index] = { ...selectedEquipo.value };
    Swal.fire({
      title: 'Actualizado',
      text: 'El equipo ha sido actualizado exitosamente.',
      icon: 'success',
      background: '#181c2c',
    });
    isModalActive.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Modal para editar equipo -->
    <div v-if="isModalActive" class="modal-overlay">
      <div class="modal">
        <h3>Editar Equipo</h3>
        <input v-model="selectedEquipo.label" placeholder="Nombre del equipo" />
        <div>
          <button @click="saveEquipo">Guardar</button>
          <button @click="isModalActive = false">Cancelar</button>
        </div>
      </div>
    </div>

    <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Modelo</th>
        <th>Marca</th>
        <th>Serie</th>
        <th class="center-text">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="equipo in equiposSeleccionados" :key="equipo.id">
        <td>{{ equipo.label }}</td>
        <td>{{ equipo.modelo }}</td>
        <td>{{ equipo.marca }}</td>
        <td>{{ equipo.serie }}</td>
        <td class="center-text">
          <BaseButton 
            color="danger" 
            :icon="mdiTrashCan" 
            small 
            @click="confirmDelete(equipo)" 
            tooltip="Eliminar" 
          />
        </td>
      </tr>
      <tr v-if="!equiposSeleccionados.length">
        <td colspan="6" class="center-text">No hay equipos seleccionados.</td>
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
</style>
