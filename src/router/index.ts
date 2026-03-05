import { createRouter, createWebHistory } from "vue-router"
import ScheduleCalendar from "../view/ScheduleCalendar.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: ScheduleCalendar
    }
  ]
})

export default router