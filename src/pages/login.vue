<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)


const login = async () => {

  error.value = ""
  loading.value = true

  try{

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
      loading.value=false
      return
    }

    localStorage.setItem("role",data.role)
    localStorage.setItem("user",JSON.stringify(data.user))

    if(data.role==="admin"){
      router.push("/admin/dashboard")
    }else{
      router.push("/doctor/homepage")
    }

  }catch(err){
    error.value="Server error"
  }

  loading.value=false
}
</script>

<template>

<div class="login-page">

  <div class="login-card">

    <div class="logo">
      🏥
    </div>

    <h1>Hospital System</h1>
    <p class="subtitle">Login in to continue</p>

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

    <button @click="login" :disabled="loading">
      {{ loading ? "Signing in..." : "Login" }}
    </button>

  </div>

</div>

</template>

<style scoped>

/* PAGE */

.login-page{
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:linear-gradient(135deg,#f4f6f8,#e3f2fd);

}

/* CARD */

.login-card{
width:360px;
background:white;
padding:40px;
border-radius:16px;
box-shadow:0 8px 24px rgba(0,0,0,0.08);
text-align:center;
}

/* LOGO */

.logo{
font-size:40px;
margin-bottom:10px;
}

/* TITLE */

h1{
font-size:22px;
margin-bottom:4px;
color:#1976d2;
}

.subtitle{
font-size:14px;
color:#777;
margin-bottom:25px;
}

/* INPUT */

input{
width:100%;
padding:12px;
margin-bottom:14px;
border:1px solid #ddd;
border-radius:8px;
outline:none;
font-size:14px;
transition:all .2s;
}

input:focus{
border-color:#1976d2;
box-shadow:0 0 0 3px rgba(25,118,210,0.15);
}

/* BUTTON */

button{
width:100%;
padding:12px;
border:none;
background:#1976d2;
color:white;
border-radius:8px;
cursor:pointer;
font-weight:500;
transition:all .2s;
font-family:'Outfit', sans-serif;
}

button:hover{
background:#1565c0;
}

button:disabled{
background:#90caf9;
cursor:not-allowed;
}

/* ERROR */

.error{
color:#e53935;
font-size:13px;
margin-bottom:10px;
}

</style>