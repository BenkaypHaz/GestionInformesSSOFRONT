import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import permissionsStore from '@/stores/stores' 

export const useMainStore = defineStore('main', () => {
  const userEmail = ref('doe.doe.doe@example.com')
  const user = computed(() => permissionsStore.getUser())

  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  )
  const userNombre = computed(() => user.value ? user.value.nombre : 'Usuario')
  const userName = ref(userNombre)

  const isFieldFocusRegistered = ref(false)

  const clients = ref([])
  const history = ref([])

  function setUser(payload) {
    if (payload.name) {
      userName.value = userNombre
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
    if (payload.nombre) { // Add this condition
      userNombre.value = payload.nombre
    }
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return {
    userName,
    userEmail,
    userNombre,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    setUser,
    fetchSampleClients,
    fetchSampleHistory
  }
})
