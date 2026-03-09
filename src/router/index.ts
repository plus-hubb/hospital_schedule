import {createRouter,createWebHashHistory} from "vue-router"

import Dashboard from "../pages/admin/dashboard.vue"
import Doctors from "../pages/admin/doctors.vue"
import Groups from "../pages/admin/groups.vue"
import ManageDoctors from "../pages/admin/manageDoctors.vue"
import ManageGroups from "../pages/admin/manageGroups.vue"
import Login from "../pages/login.vue"
import Homepage from "../pages/doctor/homepage.vue"

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
path:"/admin/manage-groups",
component:ManageGroups
},

{
path:"/docter/homepage",
component:Homepage
},

{
path:"/",
name:"login",
component:Login
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

router.beforeEach((to,_,next)=>{

const role = localStorage.getItem("role")

if(to.path.startsWith("/admin") && role!=="admin"){

return next("/")

}

if(to.path.startsWith("/doctor") && role!=="doctor"){

return next("/")

}

next()

})

export default router