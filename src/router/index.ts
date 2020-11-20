import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import MultipleInputs from "@/views/SearchPatient.vue";
import HClocation from '../views/HClocation.vue';
import SearchPatient from "@/views/SearchPatient.vue";

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
    path: '/search_patient',
    name: 'Search Patient',
    component: SearchPatient
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
