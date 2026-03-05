import {createRouter,createWebHistory} from "vue-router"

import Dashboard from "../pages/admin/dashboard.vue"
import Doctors from "../pages/admin/doctors.vue"
import Groups from "../pages/admin/groups.vue"
import ManageDoctors from "../pages/admin/manageDoctors.vue"
import ManageGroups from "../pages/admin/manageGroups.vue"

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
}

]

const router = createRouter({
history:createWebHistory(),
routes
})

export default router