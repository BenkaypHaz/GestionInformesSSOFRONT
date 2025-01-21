import {
  mdiMenu,
  mdiClockOutline,
  mdiCloud,
  mdiCrop,
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
  mdiGithub,
  mdiReact
} from '@mdi/js'

export default [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'Cambiar Clave',
        to: '/cambiarclave'
      },
      {
        isDivider: true
      },
      {
        icon: mdiLogout,
        label: 'Cerrar sesion',
        to: '/',
        isLogout: true
      }
    ]
  },

  

]
