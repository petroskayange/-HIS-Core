import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import MultipleInputs from "@/views/MultipleInputs.vue";
import HClocation from '../views/HClocation.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/multiple_inputs',
    name: 'Multiple Inputs',
    component: MultipleInputs
  },
  {
    path: '/select_hc_location',
    name: 'HC Location',
    component: HClocation
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
