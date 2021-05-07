import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

// Users
const Users = () => import('@/views/users/Users')

//Loteria
const Premios = () => import('@/views/resources/Premios')
const Imagenes = () => import('@/views/resources/Imagenes')
const Actualizaciones = () => import('@/views/resources/Actualizaciones')
const Canjes = () => import('@/views/resources/Canjes')
const Jugadores = () => import('@/views/resources/Jugadores')
const Departamentos = () => import('@/views/resources/Departamentos')
const Municipios = () => import('@/views/resources/Municipios')

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes() {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'users',
          meta: {
            label: 'Users'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Users',
              component: Users
            },
          ]
        },
        {
          path: 'premios',
          meta: {
            label: 'Premios'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Premios',
              component: Premios
            },
          ]
        },
        {
          path: 'imagenes',
          meta: {
            label: 'Imagenes'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Imagenes',
              component: Imagenes
            },
          ]
        },
        {
          path: 'canjes',
          meta: {
            label: 'Canjes'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Canjes',
              component: Canjes
            },
          ]
        },
        {
          path: 'actualizaciones',
          meta: {
            label: 'Actualizaciones'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Actualizaciones',
              component: Actualizaciones
            },
          ]
        },
        {
          path: 'jugadores',
          meta: {
            label: 'Jugadores'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Jugadores',
              component: Jugadores
            },
          ]
        },
        {
          path: 'departamentos',
          meta: {
            label: 'Departamentos'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Departamentos',
              component: Departamentos
            },
          ]
        },
        {
          path: 'municipios',
          meta: {
            label: 'Municipios'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Municipios',
              component: Municipios
            },
          ]
        },
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render(c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    }
  ]
}

