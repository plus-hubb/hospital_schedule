<template>

<div class="layout">

<Navbar/>

<div class="content">

<h1>Doctor Groups</h1>

<ul>
<li>Group A</li>
<li>Group B</li>
<li>Group C</li>
<li>Group D</li>
</ul>

</div>

</div>

</template>

<script setup lang="ts">
import Navbar from "../../components/Navbar.vue"
</script>

<style scoped>

.layout{
display:flex;
font-family: Arial, Helvetica, sans-serif
}

.content{
padding:30px;
flex:1;
background:#fafafa;
}

</style>