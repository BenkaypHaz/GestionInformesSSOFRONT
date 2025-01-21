import {
  mdiMonitor,
  mdiAccountGroup,
  mdiFileChart,
  mdiDomain,
  mdiScrewMachineRoundTop 
} from '@mdi/js'

export default [
  {
    to: '/dashbooard',
    icon: mdiMonitor,
    label: 'Dashboard',
    roles: [1, 2]
  },
  {
    label: 'Informes',
    icon: mdiFileChart ,
    roles: [1],
    menu: [
      {
        
        label: 'Informe de calor',
        to: '/crearinformecalor'
      },
    ]
  },
  {
    label: 'Empresas',
    icon: mdiDomain ,
    roles: [1],
    menu: [
      {
        
        label: 'Crear Empresa',
        to: '/crearempresa'
      },
      {
        label: 'Editar Empresa',
        to: '/editarusuario'
      }
    ]
  },
  {
    label: 'Equipos',
    icon: mdiScrewMachineRoundTop ,
    roles: [1],
    menu: [
      {
        
        label: 'Crear Equipo',
        to: '/crearequipos'
      },
      {
        label: 'Editar Equipo',
        to: '/editarusuario'
      }
    ]
  },
  {
    label: 'Usuarios',
    icon: mdiAccountGroup,
    roles: [1],
    menu: [
      {
        
        label: 'Crear Usuario',
        to: '/crearusuario'
      },
      {
        label: 'Editar Usuario',
        to: '/editarusuario'
      }
    ]
  },
]
