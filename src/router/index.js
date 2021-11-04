import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/auth/Login'
import Home from '@/views/schedule/Home.vue'
import Register from '@/views/schedule/Register.vue'
import Edit from '@/views/schedule/Edit.vue'
import UserRegister from '@/views/auth/UserRegister'
import store from '@/store'
import NotFound from '@/views/404';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter(to, from, next) {
      if (!store.getters['auth/check']) {
        next('/login')
      } else {
        next()
      }
    },
  },
  {
    path: '/register',
    name: 'Register',
    props: true,
    component: Register,
    beforeEnter(to, from, next) {
      if (!store.getters['auth/check']) {
        next('/login')
      } else {
        next()
      }
    },
  },
  {
    path: '/edit',
    name: 'Edit',
    props: true,
    component: Edit,
    beforeEnter(to, from, next) {
      if (!store.getters['auth/check']) {
        next('/login')
      } else {
        next()
      }
    },
  },
  {
    path: '/userregister',
    component: UserRegister,
    beforeEnter(to, from, next) {
      if (store.getters['auth/check']) {
        next('/')
      } else {
        next()
      }
    },
  },
  {
    path: '/login',
    component: Login,
    beforeEnter(to, from, next) {
      if (store.getters['auth/check']) {
        next('/')
      } else {
        next()
      }
    },
  },
  {
    path: '*',
    component: NotFound,
  },
  // todo 後回し
  // {
  //   path: '/list',
  // 	name: 'List',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/List.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  // eslint-disable-next-line no-undef
  base: process.env.BASE_URL,
  routes
})

export default router
