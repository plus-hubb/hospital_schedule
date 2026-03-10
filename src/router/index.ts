import {createRouter,createWebHashHistory} from "vue-router"

import Dashboard from "../pages/admin/dashboard.vue"
import Doctors from "../pages/admin/doctors.vue"
import Groups from "../pages/admin/groups.vue"
import ManageDoctors from "../pages/admin/manageDoctors.vue"
import Login from "../pages/login.vue"
import Homepage from "../pages/doctor/homepage.vue"
import MySchedule from "../pages/doctor/mySchedule.vue"
import Notifications from "../pages/doctor/notification.vue"

const routes = [

{
path:"/admin/dashboard",
component:Dashboard
},



{
path:"/admin/doctors",
component:Doctors
},

{
path:"/admin/groups",
component:Groups
},

{
path:"/admin/manage-doctors",
component:ManageDoctors
},

{
path:"/doctor/homepage",
component:Homepage
},

{
path:"/",
name:"login",
component:Login
},

{
path:"/doctor/mySchedule",
component:MySchedule
},

{
path:"/doctor/notification",
component:Notifications
},  

{
 path: "/:pathMatch(.*)*",
 redirect: "/"
},

]

const router = createRouter({
history:createWebHashHistory(),
routes
})

router.beforeEach((to, _, next) => {

  const role = sessionStorage.getItem("role")

  // ยังไม่ login
  if (!role && to.path !== "/") {
    return next("/")
  }

  // login แล้วแต่เปิด login page
  if (role && to.path === "/") {

    if (role === "admin") {
      return next("/admin/dashboard")
    }

    if (role === "doctor") {
      return next("/doctor/homepage")
    }

  }

  // doctor ห้ามเข้า admin
  if (role === "doctor" && to.path.startsWith("/admin")) {
    return next("/doctor/homepage")
  }

  // admin ห้ามเข้า doctor
  if (role === "admin" && to.path.startsWith("/doctor")) {
    return next("/admin/dashboard")
  }

  next()

})

export default router