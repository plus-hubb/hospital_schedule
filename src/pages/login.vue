<script setup lang="ts">

import {ref} from "vue"
import {useRouter} from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")

const login = async()=>{

error.value=""

const res = await fetch("https://balanced-upliftment-production-c650.up.railway.app/login",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:email.value,
password:password.value
})

})

const data = await res.json()

if(!res.ok){

error.value="Email or password incorrect"
return

}

localStorage.setItem("role",data.role)
localStorage.setItem("user",JSON.stringify(data.user))

if(data.role==="admin"){

router.push("/admin/dashboard")

}else{

router.push("/doctor/homepage")

}

}

</script>

<template>

<div class="login-page">

<div class="login-box">

<h1>Hospital Login</h1>

<input
v-model="email"
placeholder="Email"
/>

<input
v-model="password"
type="password"
placeholder="Password"
/>

<p class="error" v-if="error">
{{error}}
</p>

<button @click="login">
Login
</button>

</div>

</div>

</template>

<style scoped>

.login-page{
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#f4f6f8;
font-family:Arial, Helvetica, sans-serif;
}

.login-box{
width:340px;
background:white;
padding:40px;
border-radius:12px;
box-shadow:0 4px 12px rgba(0,0,0,0.05);
text-align:center;
}

/* TITLE */

h1{
margin-bottom:25px;
font-weight:600;
color:#1976d2;
}

/* INPUT */

input{
width:100%;
padding:10px;
margin-bottom:15px;
border:1px solid #90caf9;
border-radius:6px;
outline:none;
transition:0.2s;
}

input:focus{
border-color:#1976d2;
box-shadow:0 0 0 2px #e3f2fd;
}

/* BUTTON */

button{
width:100%;
padding:10px;
border:none;
background:#1976d2;
color:white;
border-radius:6px;
cursor:pointer;
transition:0.2s;
font-weight:500;
}

button:hover{
background:#1565c0;
}

/* ERROR */

.error{
color:#e53935;
font-size:14px;
margin-bottom:10px;
}

</style>