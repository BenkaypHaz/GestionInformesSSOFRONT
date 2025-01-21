import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/LoginView.vue'
import permissionsStore from '@/stores/stores'; 


const routes = [
  {
    meta: {
      title: 'Iniciar Sesion'
    },
    path: '/',
    name: '',
    component: Login
  },
  {
    meta: {
      title: 'Iniciar Sesion'
    },
    path: '/',
    name: 'login',
    component: Login
  },
  {
    meta: {
      title: 'Dashboard',
      requiresAuth: false,
      permission: 'Dashboard'
    },
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardAdmin.vue')
  },
  
  {
    path: '/denegado',
    name: 'denegado',
    component: () => import('../views/Denegado.vue'),
    props: true
  },
  {
    meta: {
      title: 'Informes',
      requiresAuth: false,
      permission: 'Informe de calor'
    },
    path: '/crearinformecalor',
    name: 'crearinformecalor',
    component: () => import('../views/CrearInformeCalor.vue')
  },
  {
    meta: {
      title: 'Usuarios',
      requiresAuth: false,
      permission: 'Gestionar Usuarios'
    },
    path: '/crearusuario',
    name: 'crearusuario',
    component: () => import('../views/AgregarUsuarioView.vue')
  },
  
  {
    meta: {
      title: 'CambiarClave',
      requiresAuth: false,
      permission: 'Editar Proveedores'
    },
    path: '/cambiarclave',
    name: 'cambiarclave',
    component: () => import('../views/ChangePasswordView.vue')
  },
  {
    meta: {
      title: 'Crear Empresas',
      requiresAuth: false,
      permission: 'Crear Empresas'
    },
    path: '/crearempresa',
    name: 'crearempresa',
    component: () => import('../views/AgregarEmpresa.vue')
  },
  {
    meta: {
      title: 'Crear Equipos',
      requiresAuth: false,
      permission: 'Crear Equipos'
    },
    path: '/crearequipos',
    name: 'crearequipos',
    component: () => import('../views/AgregarEquipo.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const userPermissions = permissionsStore.state.permissions;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!userPermissions.length) {
      next({ name: 'login' });
    } else if (to.meta.permission && !userPermissions.includes(to.meta.permission)) {
      next({ name: 'denegado' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
